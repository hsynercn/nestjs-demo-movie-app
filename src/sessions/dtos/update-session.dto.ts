import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TimeSlot } from 'src/shared/enums';

export class UpdateSessionDto {
  @IsOptional()
  @IsNumber()
  movieId: number;

  @IsOptional()
  @IsNumber()
  roomId: number;

  @IsOptional()
  @IsDate()
  date: Date;

  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;
}
