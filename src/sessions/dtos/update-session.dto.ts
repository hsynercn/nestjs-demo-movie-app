import { IsDate, IsEnum, IsNumber, Optional } from 'class-validator';
import { TimeSlot } from 'src/shared/enums';

export class UpdateSessionDto {
  @Optional()
  @IsNumber()
  movieId: number;

  @Optional()
  @IsNumber()
  roomId: number;

  @Optional()
  @IsDate()
  date: Date;

  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;
}
