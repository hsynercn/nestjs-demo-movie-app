import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsNumber()
  capacity: number;
}
