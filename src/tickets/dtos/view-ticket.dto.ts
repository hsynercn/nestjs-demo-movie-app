import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { TicketState, TimeSlot } from '../../shared/enums';

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

  @IsEnum(TicketState)
  state: TicketState;

  @IsString()
  roomName: string;
}
