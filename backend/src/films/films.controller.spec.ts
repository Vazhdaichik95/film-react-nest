import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;

  const mockFilmsService = {
    findAll: jest.fn(),
    findSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all films', async () => {
    const response = {
      total: 1,
      items: [
        {
          id: '1',
          title: 'Inception',
          rating: 9,
          director: 'Christopher Nolan',
          tags: ['sci-fi'],
          about: 'about',
          description: 'description',
          image: 'image.jpg',
          cover: 'cover.jpg',
        },
      ],
    };

    mockFilmsService.findAll.mockResolvedValue(response);

    const result = await controller.findAll();

    expect(result).toEqual(response);
    expect(mockFilmsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return film schedule by id', async () => {
    const filmId = '1';
    const response = {
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
    };

    mockFilmsService.findSchedule.mockResolvedValue(response);

    const result = await controller.findSchedule(filmId);

    expect(result).toEqual(response);
    expect(mockFilmsService.findSchedule).toHaveBeenCalledTimes(1);
    expect(mockFilmsService.findSchedule).toHaveBeenCalledWith(filmId);
  });
});
