import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    const courseEntity = this.courseRepository.create({
      ...createCourseDto,
      dateCreated: new Date(),
    });
    return await this.courseRepository.save(courseEntity);
  }

  async findAll(courseQuery: CourseQuery): Promise<Course[]> {
    Object.keys(courseQuery).forEach((key) => {
      courseQuery[key] = ILike(`%${courseQuery[key]}%`);
    });
    return await this.courseRepository.find({
      where: courseQuery,
      order: {
        name: 'ASC',
        description: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);
    const courseEntity = this.courseRepository.create({
      id: course.id,
      ...updateCourseDto,
    });
    return await this.courseRepository.save(courseEntity);
  }

  async delete(id: string): Promise<string> {
    const course = await this.findById(id);
    await this.courseRepository.delete({ id: course.id });
    return id;
  }

  async count(): Promise<number> {
    return await this.courseRepository.count();
  }
}
