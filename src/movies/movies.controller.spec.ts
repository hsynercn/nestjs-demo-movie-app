import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieEntity } from './movies.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateMovieDto } from './dtos/update-movie.dto';

describe('MoviesController', () => {
  let moviesController: MoviesController;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(MovieEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    moviesController = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  describe('createMovie', () => {
    it('should create a new movie', async () => {
      const newMovie: CreateMovieDto = { name: 'Test Movie', minAge: 10 };
      const createdMovie = { id: 1, ...newMovie };
      jest.spyOn(moviesService, 'create').mockResolvedValue(createdMovie);

      const result = await moviesController.createMovie(newMovie);

      expect(result).toEqual(createdMovie);
      expect(moviesService.create).toHaveBeenCalledWith(newMovie);
    });
  });

  describe('findMovie', () => {
    it('should return a movie by ID', async () => {
      const movieId = '1';
      const movie: MovieEntity = { id: 1, name: 'Test Movie', minAge: 10 };
      jest
        .spyOn(moviesService, 'findOne')
        .mockImplementation(() => Promise.resolve(movie));

      expect(await moviesController.findMovie(movieId)).toEqual(movie);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const movieId = '1';
      jest
        .spyOn(moviesService, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(moviesController.findMovie(movieId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('findAllMovies', () => {
    it('should return an array of movies', () => {
      const movies: MovieEntity[] = [
        { id: 1, name: 'Test Movie 1', minAge: 10 },
        { id: 2, name: 'Test Movie 2', minAge: 10 },
      ];
      jest
        .spyOn(moviesService, 'find')
        .mockImplementation(() => Promise.resolve(movies));

      expect(moviesController.findAllMovies()).resolves.toEqual(movies);
    });
  });

  describe('removeMovie', () => {
    it('should remove a movie by ID', async () => {
      const movieId = '1';

      jest.spyOn(moviesService, 'remove').mockResolvedValueOnce(undefined);

      const result = await moviesController.removeMovie(movieId);

      expect(moviesService.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      const movieId = '1';
      const updateMovieDto: UpdateMovieDto = {
        name: 'Updated Movie',
        minAge: 20,
      };
      const updatedMovie: MovieEntity = {
        id: 1,
        name: 'Updated Movie',
        minAge: 30,
      };

      jest.spyOn(moviesService, 'update').mockResolvedValueOnce(updatedMovie);

      const result = await moviesController.updateMovie(
        movieId,
        updateMovieDto,
      );

      expect(moviesService.update).toHaveBeenCalledWith(1, updateMovieDto);
      expect(result).toEqual(updatedMovie);
    });
  });
});
