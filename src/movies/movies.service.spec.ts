import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { MovieEntity } from './movies.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let movieRepository: Repository<MovieEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(MovieEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    moviesService = module.get<MoviesService>(MoviesService);
    movieRepository = module.get<Repository<MovieEntity>>(
      getRepositoryToken(MovieEntity),
    );
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const newMovie: CreateMovieDto = { name: 'Test Movie', minAge: 10 };
      const savedMovie: MovieEntity = { id: 1, ...newMovie };
      jest.spyOn(movieRepository, 'create').mockReturnValue(savedMovie);
      jest.spyOn(movieRepository, 'save').mockResolvedValue(savedMovie);

      const result = await moviesService.create(newMovie);

      expect(result).toEqual(savedMovie);
      expect(movieRepository.create).toHaveBeenCalledWith(newMovie);
      expect(movieRepository.save).toHaveBeenCalledWith(savedMovie);
    });
  });

  describe('findOne', () => {
    it('should return a movie by ID', async () => {
      const movieId = 1;
      const foundMovie: MovieEntity = {
        id: movieId,
        name: 'Test Movie',
        minAge: 10,
      };
      jest.spyOn(movieRepository, 'findOne').mockResolvedValue(foundMovie);

      const result = await moviesService.findOne(movieId);

      expect(result).toEqual(foundMovie);
      expect(movieRepository.findOne).toHaveBeenCalledWith({
        where: { id: movieId },
      });
    });
  });

  describe('find', () => {
    it('should return an array of movies', async () => {
      const foundMovies: MovieEntity[] = [
        { id: 1, name: 'Movie 1', minAge: 10 },
        { id: 2, name: 'Movie 2', minAge: 20 },
      ];
      jest.spyOn(movieRepository, 'find').mockResolvedValue(foundMovies);

      const result = await moviesService.find();

      expect(result).toEqual(foundMovies);
      expect(movieRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const movieId = 1;
      const updateMovieDto: UpdateMovieDto = {
        name: 'Updated Movie',
        minAge: 10,
      };
      const existingMovie: MovieEntity = {
        id: movieId,
        name: 'Movie',
        minAge: 8,
      };
      const updatedMovie: MovieEntity = { id: movieId, ...updateMovieDto };
      jest.spyOn(moviesService, 'findOne').mockResolvedValue(existingMovie);
      jest.spyOn(movieRepository, 'save').mockResolvedValue(updatedMovie);

      const result = await moviesService.update(movieId, updateMovieDto);

      expect(result).toEqual(updatedMovie);
      expect(moviesService.findOne).toHaveBeenCalledWith(movieId);
      expect(movieRepository.save).toHaveBeenCalledWith(updatedMovie);
    });
    it('should throw NotFoundException if movie is not found', async () => {
      const movieId = 1;
      const updateMovieDto: UpdateMovieDto = {
        name: 'Updated Movie',
        minAge: 10,
      };
      jest.spyOn(moviesService, 'findOne').mockResolvedValue(null);

      await expect(
        moviesService.update(movieId, updateMovieDto),
      ).rejects.toThrow(NotFoundException);
      expect(moviesService.findOne).toHaveBeenCalledWith(movieId);
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      const movieId = 1;
      const existingMovie: MovieEntity = {
        id: movieId,
        name: 'Movie',
        minAge: 10,
      };
      jest.spyOn(moviesService, 'findOne').mockResolvedValue(existingMovie);
      jest.spyOn(movieRepository, 'remove').mockResolvedValue(existingMovie);

      const result = await moviesService.remove(movieId);

      expect(result).toEqual(existingMovie);
      expect(moviesService.findOne).toHaveBeenCalledWith(movieId);
      expect(movieRepository.remove).toHaveBeenCalledWith(existingMovie);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const movieId = 1;
      jest.spyOn(moviesService, 'findOne').mockResolvedValue(null);

      await expect(moviesService.remove(movieId)).rejects.toThrow(
        NotFoundException,
      );
      expect(moviesService.findOne).toHaveBeenCalledWith(movieId);
    });
  });
});
