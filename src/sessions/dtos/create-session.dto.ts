import { IsDate, IsEnum, IsNumber } from 'class-validator';
import { TimeSlot } from 'src/shared/enums';

export class CreateSessionDto {
  @IsNumber()
  movieId: number;

  @IsNumber()
  roomId: number;

  @IsDate()
  date: Date;

  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;
}
