import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  name: string;
  
  @ApiProperty()
  @IsNumber()
  minAge: number;
}
