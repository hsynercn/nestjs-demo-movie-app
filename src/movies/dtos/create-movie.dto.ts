import { IsNumber, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  name: string;
  @IsNumber()
  minAge: number;
}
