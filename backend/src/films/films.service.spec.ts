import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmRepository } from '../repository/film.repository';

describe('FilmsService', () => {
  let service: FilmsService;

  const mockFilmRepository = {
    findAll: jest.fn(),
    findByFilmId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmRepository,
          useValue: mockFilmRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return mapped films response', async () => {
      mockFilmRepository.findAll.mockResolvedValue([
        {
          id: '1',
          rating: 9,
          director: 'Christopher Nolan',
          tags: ['sci-fi'],
          title: 'Inception',
          about: 'about',
          description: 'description',
          image: 'image.jpg',
          cover: 'cover.jpg',
        },
      ]);

      const result = await service.findAll();

      expect(result).toEqual({
        total: 1,
        items: [
          {
            id: '1',
            rating: 9,
            director: 'Christopher Nolan',
            tags: ['sci-fi'],
            title: 'Inception',
            about: 'about',
            description: 'description',
            image: 'image.jpg',
            cover: 'cover.jpg',
          },
        ],
      });

      expect(mockFilmRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty response when there are no films', async () => {
      mockFilmRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });
  });

  describe('findSchedule', () => {
    it('should return mapped schedule response', async () => {
      mockFilmRepository.findByFilmId.mockResolvedValue({
        id: '1',
        schedule: [
          {
            id: 'session-1',
            daytime: '2026-05-26T18:00:00.000Z',
            hall: 1,
            rows: 10,
            seats: 20,
            price: 500,
            taken: ['1:1', '1:2'],
          },
        ],
      });

      const result = await service.findSchedule('1');

      expect(result).toEqual({
        total: 1,
        items: [
          {
            id: 'session-1',
            daytime: '2026-05-26T18:00:00.000Z',
            hall: 1,
            rows: 10,
            seats: 20,
            price: 500,
            taken: ['1:1', '1:2'],
          },
        ],
      });

      expect(mockFilmRepository.findByFilmId).toHaveBeenCalledTimes(1);
      expect(mockFilmRepository.findByFilmId).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when film is not found', async () => {
      mockFilmRepository.findByFilmId.mockResolvedValue(null);

      try {
        await service.findSchedule('999');
        fail('Expected NotFoundException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as Error).message).toBe('Film with id "999" not found');
      }
    });

    it('should return empty schedule when film has no sessions', async () => {
      mockFilmRepository.findByFilmId.mockResolvedValue({
        id: '1',
        schedule: [],
      });

      const result = await service.findSchedule('1');

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });
  });
});
