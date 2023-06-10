import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findOne(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findOneWithId(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(newUser: CreateUserDto) {
    const userExisting = await this.findOne(newUser.email);
    if (userExisting) {
      throw new BadRequestException('Invalid request');
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(newUser.password, saltOrRounds);
    newUser.password = hash;
    const user = this.userRepository.create({ ...newUser });
    const newUserResult = await this.userRepository.save(user);
    return {
      id: newUserResult.id,
      email: newUserResult.email,
      role: newUserResult.role,
      dateOfBirth: newUserResult.dateOfBirth,
    };
  }
}
