import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginUserDto) {
    const userEntity = await this.userService.findOne(user.username);
    const payload = {
      username: user.username,
      sub: user.password,
      role: userEntity.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
