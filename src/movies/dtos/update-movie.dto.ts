import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateMovieDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;
  
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  minAge: number;
}
