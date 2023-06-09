import { Transform, Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber } from 'class-validator';
import { IgnoreUTCTime } from '../../shared/time';
import { TimeSlot } from '../../shared/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty()
  @IsNumber()
  movieId: number;

  @ApiProperty()
  @IsNumber()
  roomId: number;

  @ApiProperty()
  @IsDateString({ strict: true })
  @Transform(({ value }) => IgnoreUTCTime(new Date(value)).toISOString())
  date: Date;

  @ApiProperty({ enum: TimeSlot })
  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;
}
