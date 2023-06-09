import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { TimeSlot } from '../../shared/enums';

export class ViewSessionDto {
  @IsNumber()
  id: number;

  @IsString()
  movieName: string;

  @IsNumber()
  minAge: number;

  @IsDate()
  date: Date;

  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;

  @IsString()
  roomName: string;

  @IsNumber()
  capacity: number;
}
