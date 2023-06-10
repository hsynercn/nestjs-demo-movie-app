import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../shared/enums';
import { Roles } from '../shared/roles.decorator';

@Controller('movies')
@ApiTags('movies')
@ApiBearerAuth()
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Post()
  @Roles(UserRole.Admin)
  createMovie(@Body() body: CreateMovieDto) {
    return this.moviesService.create(body);
  }

  @Get('/:id')
  @Roles(UserRole.Admin, UserRole.User)
  async findMovie(@Param('id') id: string) {
    const movie = await this.moviesService.findOne(parseInt(id));
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  @Get()
  @ApiQuery({ name: 'movieName', required: false, type: 'string' })
  @ApiQuery({ name: 'upperAgeLimit', required: false, type: 'string' })
  @Roles(UserRole.Admin, UserRole.User)
  findAllMovies(
    @Query('movieName') movieName?: string,
    @Query('upperAgeLimit') upperAgeLimit?: string,
  ) {
    return this.moviesService.find(movieName, parseInt(upperAgeLimit));
  }

  @Delete('/:id')
  @Roles(UserRole.Admin)
  removeMovie(@Param('id') id: string) {
    return this.moviesService.remove(parseInt(id));
  }

  @Patch('/:id')
  @Roles(UserRole.Admin)
  updateMovie(@Param('id') id: string, @Body() body: UpdateMovieDto) {
    return this.moviesService.update(parseInt(id), body);
  }
}
