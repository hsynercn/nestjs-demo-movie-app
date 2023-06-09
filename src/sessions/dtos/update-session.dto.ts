import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TimeSlot } from '../../shared/enums';
import { IgnoreUTCTime } from '../../shared/time';

export class UpdateSessionDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  movieId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  roomId: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString({ strict: true })
  @Transform(({ value }) => IgnoreUTCTime(new Date(value)).toISOString())
  date: Date;

  @ApiProperty({ enum: TimeSlot })
  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;
}
