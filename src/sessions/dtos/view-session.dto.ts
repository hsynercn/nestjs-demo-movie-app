import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { TimeSlot } from 'src/shared/enums';

export class ViewTicketDto {
  @IsNumber()
  id: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  sessionId: number;

  @IsString()
  movieName: string;

  @IsDate()
  date: Date;

  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;

  @IsString()
  roomName: string;
}
