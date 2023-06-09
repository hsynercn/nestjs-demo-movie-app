import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/shared/roles.decorator';
import { UserRole } from 'src/shared/enums';

@Controller('movie')
@Roles(UserRole.Admin)
@ApiBearerAuth()
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Post()
  createUser(@Body() body: CreateMovieDto) {
    console.log('body', body);
    return this.moviesService.create(body);
  }

  @Get('/:id')
  async findMovie(@Param('id') id: string) {
    const movie = await this.moviesService.findOne(parseInt(id));
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  @Get()
  findAllMovies() {
    return this.moviesService.find();
  }

  @Delete('/:id')
  removeMovie(@Param('id') id: string) {
    return this.moviesService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateMovie(@Param('id') id: string, @Body() body: UpdateMovieDto) {
    return this.moviesService.update(parseInt(id), body);
  }
}
