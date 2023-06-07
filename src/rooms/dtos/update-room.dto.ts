import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateRoomDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  capacity: number;
}
