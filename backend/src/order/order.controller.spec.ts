import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create order', async () => {
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

    const response = {
      total: 1,
      items: [
        {
          id: 'generated-id',
          ...dto.tickets[0],
        },
      ],
    };

    mockOrderService.create.mockResolvedValue(response);

    const result = await controller.create(dto);

    expect(result).toEqual(response);
    expect(mockOrderService.create).toHaveBeenCalledTimes(1);
    expect(mockOrderService.create).toHaveBeenCalledWith(dto);
  });
});
