import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CourseService } from '../course/course.service';
import { CreateContentDto, UpdateContentDto } from './content.dto';
import { Content } from './content.entity';
import { ContentQuery } from './content.query';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    private readonly courseService: CourseService,
  ) {}

  async save(
    courseId: string,
    createContentDto: CreateContentDto,
  ): Promise<Content> {
    const { name, description } = createContentDto;
    const course = await this.courseService.findById(courseId);
    const contentEntity = this.contentRepository.create({
      name,
      description,
      course,
      dateCreated: new Date(),
    });
    return await this.contentRepository.save(contentEntity);
  }

  async findAll(contentQuery: ContentQuery): Promise<Content[]> {
    Object.keys(contentQuery).forEach((key) => {
      contentQuery[key] = ILike(`%${contentQuery[key]}%`);
    });

    return await this.contentRepository.find({
      where: contentQuery,
      order: {
        name: 'ASC',
        description: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<Content> {
    const content = await this.contentRepository.findOne({ where: { id } });

    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return content;
  }

  async findByCourseIdAndId(courseId: string, id: string): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { courseId, id },
    });
    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return content;
  }

  async findAllByCourseId(
    courseId: string,
    contentQuery: ContentQuery,
  ): Promise<Content[]> {
    Object.keys(contentQuery).forEach((key) => {
      contentQuery[key] = ILike(`%${contentQuery[key]}%`);
    });
    return await this.contentRepository.find({
      where: { courseId, ...contentQuery },
      order: {
        name: 'ASC',
        description: 'ASC',
      },
    });
  }

  async update(
    courseId: string,
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    const content = await this.findByCourseIdAndId(courseId, id);
    const contentEntity = this.contentRepository.create({
      id: content.id,
      ...updateContentDto,
    });
    return await this.contentRepository.save(contentEntity);
  }

  async delete(courseId: string, id: string): Promise<string> {
    const content = await this.findByCourseIdAndId(courseId, id);
    await this.contentRepository.delete({ id: content.id });
    return id;
  }

  async count(): Promise<number> {
    return await this.contentRepository.count();
  }
}
