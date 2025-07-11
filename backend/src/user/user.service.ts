import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserQuery } from './user.query';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async save(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByUsername(createUserDto.username);

    if (user) {
      throw new HttpException(
        `User with username ${createUserDto.username} is already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { password } = createUserDto;
    createUserDto.password = await bcrypt.hash(password, 10);
    const userEntity = this.userRepository.create(createUserDto);
    return await this.userRepository.save(userEntity);
  }

  async findAll(userQuery: UserQuery): Promise<User[]> {
    Object.keys(userQuery).forEach((key) => {
      if (key !== 'role') {
        userQuery[key] = ILike(`%${userQuery[key]}%`);
      }
    });

    return this.userRepository.find({
      where: {
        firstName: userQuery.firstName
          ? ILike(`%${userQuery.firstName}%`)
          : undefined,
        lastName: userQuery.lastName
          ? ILike(`%${userQuery.lastName}%`)
          : undefined,
        username: userQuery.username
          ? ILike(`%${userQuery.username}%`)
          : undefined,
        // role: userQuery.role ? ILike(`%${userQuery.role}%`) : undefined,
      },
      order: {
        firstName: 'ASC',
        lastName: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException(
        `Could not find user with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const currentUser = await this.findById(id);

    /* If username is same as before, delete it from the dto */
    if (currentUser.username === updateUserDto.username) {
      delete updateUserDto.username;
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.username) {
      if (await this.findByUsername(updateUserDto.username)) {
        throw new HttpException(
          `User with username ${updateUserDto.username} is already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const userEntity = this.userRepository.create({ id, ...updateUserDto });
    return await this.userRepository.save(userEntity);
  }

  async delete(id: string): Promise<string> {
    await this.userRepository.delete({ id });
    return id;
  }

  async count(): Promise<number> {
    return await this.userRepository.count();
  }

  /* Hash the refresh token and save it to the database */
  async setRefreshToken(id: string, refreshToken: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.update(
      { id: user.id },
      {
        refreshToken: refreshToken ? await bcrypt.hash(refreshToken, 10) : null,
      },
    );
  }
}
