import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FilmRepository } from '../repository/film.repository';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrderService', () => {
  let service: OrderService;

  const mockFilmRepository = {
    findByFilmId: jest.fn(),
    bookPlace: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FilmRepository,
          useValue: mockFilmRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create order and book tickets', async () => {
    const dto: CreateOrderDto = {
      email: 'test@test.com',
      phone: '+79999999999',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '2026-05-26T18:00:00.000Z',
          row: 5,
          seat: 7,
          price: 500,
        },
      ],
    };

    mockFilmRepository.findByFilmId.mockResolvedValue({
      id: 'film-1',
      schedule: [
        {
          id: 'session-1',
          taken: [],
        },
      ],
    });

    mockFilmRepository.bookPlace.mockResolvedValue(undefined);

    const result = await service.create(dto);

    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      film: 'film-1',
      session: 'session-1',
      daytime: '2026-05-26T18:00:00.000Z',
      row: 5,
      seat: 7,
      price: 500,
    });
    expect(result.items[0].id).toEqual(expect.any(String));

    expect(mockFilmRepository.findByFilmId).toHaveBeenCalledWith('film-1');
    expect(mockFilmRepository.bookPlace).toHaveBeenCalledWith('session-1', [
      '5:7',
    ]);
  });

  it('should return empty result if same place is duplicated in request', async () => {
    const dto: CreateOrderDto = {
      email: 'test@test.com',
      phone: '+79999999999',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '2026-05-26T18:00:00.000Z',
          row: 5,
          seat: 7,
          price: 500,
        },
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '2026-05-26T18:00:00.000Z',
          row: 5,
          seat: 7,
          price: 500,
        },
      ],
    };

    mockFilmRepository.findByFilmId.mockResolvedValue({
      id: 'film-1',
      schedule: [
        {
          id: 'session-1',
          taken: [],
        },
      ],
    });

    mockFilmRepository.bookPlace.mockResolvedValue(undefined);

    const result = await service.create(dto);

    expect(result).toEqual({
      total: 0,
      items: [],
    });

    expect(mockFilmRepository.findByFilmId).toHaveBeenCalledTimes(1);
    expect(mockFilmRepository.findByFilmId).toHaveBeenCalledWith('film-1');
    expect(mockFilmRepository.bookPlace).toHaveBeenCalledTimes(1);
    expect(mockFilmRepository.bookPlace).toHaveBeenCalledWith('session-1', [
      '5:7',
    ]);
  });

  it('should return empty result if film is not found', async () => {
    const dto: CreateOrderDto = {
      email: 'test@test.com',
      phone: '+79999999999',
      tickets: [
        {
          film: 'film-404',
          session: 'session-1',
          daytime: '2026-05-26T18:00:00.000Z',
          row: 5,
          seat: 7,
          price: 500,
        },
      ],
    };

    mockFilmRepository.findByFilmId.mockResolvedValue(null);

    const result = await service.create(dto);

    expect(result).toEqual({
      total: 0,
      items: [],
    });
  });

  it('should return empty result if session is not found', async () => {
    const dto: CreateOrderDto = {
      email: 'test@test.com',
      phone: '+79999999999',
      tickets: [
        {
          film: 'film-1',
          session: 'missing-session',
          daytime: '2026-05-26T18:00:00.000Z',
          row: 5,
          seat: 7,
          price: 500,
        },
      ],
    };

    mockFilmRepository.findByFilmId.mockResolvedValue({
      id: 'film-1',
      schedule: [],
    });

    const result = await service.create(dto);

    expect(result).toEqual({
      total: 0,
      items: [],
    });
  });

  it('should return empty result if place is already taken', async () => {
    const dto: CreateOrderDto = {
      email: 'test@test.com',
      phone: '+79999999999',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '2026-05-26T18:00:00.000Z',
          row: 5,
          seat: 7,
          price: 500,
        },
      ],
    };

    mockFilmRepository.findByFilmId.mockResolvedValue({
      id: 'film-1',
      schedule: [
        {
          id: 'session-1',
          taken: ['5:7'],
        },
      ],
    });

    const result = await service.create(dto);

    expect(result).toEqual({
      total: 0,
      items: [],
    });

    expect(mockFilmRepository.bookPlace).not.toHaveBeenCalled();
  });

  it('should return empty result if repository throws error', async () => {
    const dto: CreateOrderDto = {
      email: 'test@test.com',
      phone: '+79999999999',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '2026-05-26T18:00:00.000Z',
          row: 5,
          seat: 7,
          price: 500,
        },
      ],
    };

    mockFilmRepository.findByFilmId.mockRejectedValue(new Error('DB error'));

    const result = await service.create(dto);

    expect(result).toEqual({
      total: 0,
      items: [],
    });
  });
});
