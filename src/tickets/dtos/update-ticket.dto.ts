import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TicketState } from 'src/shared/enums';

export class UpdateTicketDto {
  @IsOptional()
  @ApiProperty()
  @IsNumber()
  userId: number;

  @IsOptional()
  @ApiProperty({ enum: TicketState })
  @IsEnum(TicketState)
  state: TicketState;
}
