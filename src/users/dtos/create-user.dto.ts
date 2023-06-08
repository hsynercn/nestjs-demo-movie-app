import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from 'src/shared/enums';
import { IgnoreUTCTime } from 'src/shared/time';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsDateString({ strict: true })
  @Transform(({ value }) => IgnoreUTCTime(new Date(value)).toISOString())
  dateOfBirth: Date;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}
