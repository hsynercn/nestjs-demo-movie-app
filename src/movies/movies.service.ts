import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './movies.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  create(newMovie: CreateMovieDto) {
    const movie = this.movieRepository.create({ ...newMovie });
    return this.movieRepository.save(movie);
  }

  findOne(id: number) {
    return this.movieRepository.findOne({ where: { id } });
  }

  async find(movieName?: string, upperAgeLimit?: number) {
    const query = this.movieRepository.createQueryBuilder('movie');
    if (movieName) {
      query.andWhere('movie.name = :movieName', { movieName });
    }
    if (upperAgeLimit) {
      query.andWhere('movie.minAge <= :upperAgeLimit', { upperAgeLimit });
    }
    return await query.getMany();
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    Object.assign(movie, updateMovieDto);
    return this.movieRepository.save(movie);
  }

  async remove(id: number) {
    const movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return this.movieRepository.remove(movie);
  }
}
