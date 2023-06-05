import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsNumber()
  @IsOptional()
  minAge: number;
}
