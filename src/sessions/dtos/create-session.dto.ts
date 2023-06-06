import { Transform, Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber } from 'class-validator';
import { IgnoreUTCTime } from 'src/shared/time';
import { TimeSlot } from 'src/shared/enums';

export class CreateSessionDto {
  @IsNumber()
  movieId: number;

  @IsNumber()
  roomId: number;

  @IsDateString({ strict: true })
  @Transform(({ value }) => IgnoreUTCTime(new Date(value)).toISOString())
  date: Date;

  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;
}
