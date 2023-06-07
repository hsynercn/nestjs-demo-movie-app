import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { TimeSlot } from 'src/shared/enums';

export class ViewSessionDto {
  @IsNumber()
  id: number;

  @IsString()
  movieName: string;

  @IsDate()
  date: Date;

  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;

  @IsString()
  roomName: string;

  @IsNumber()
  capacity: number;
}
