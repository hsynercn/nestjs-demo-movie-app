import { Body, Injectable } from '@nestjs/common';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from 'src/shared/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findOne(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  createUser(newUser: CreateUserDto) {
    const user = this.userRepository.create({
      ...newUser,
      role: UserRole.Basic,
    });
    return this.userRepository.save(user);
  }
}
