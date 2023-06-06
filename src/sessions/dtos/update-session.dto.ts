import { Transform, Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { IgnoreUTCTime } from 'src/shared/time';
import { TimeSlot } from 'src/shared/enums';

export class UpdateSessionDto {
  @IsOptional()
  @IsNumber()
  movieId: number;

  @IsOptional()
  @IsNumber()
  roomId: number;

  @IsOptional()
  @IsDateString({ strict: true })
  //@Transform(({ value }) => IgnoreTime(new Date(value)))
  date: Date;

  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;
}
