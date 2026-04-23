import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { FilmRepository } from '../repository/film.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const bookedTickets = [];

    for (const ticket of dto.tickets) {
      const film = await this.filmRepository.findByFilmId(ticket.film);

      if (!film) {
        throw new NotFoundException(`Film with id "${ticket.film}" not found`);
      }

      const session = film.schedule.find(
        (schedule) => schedule.id === ticket.session,
      );

      if (!session) {
        throw new NotFoundException(
          `Session with id "${ticket.session}" not found`,
        );
      }

      const place = `${ticket.row}:${ticket.seat}`;

      if (session.taken.includes(place)) {
        throw new BadRequestException(
          `Seat ${place} is already taken for session "${ticket.session}"`,
        );
      }

      session.taken.push(place);
      await film.save();

      bookedTickets.push({
        ...ticket,
        id: randomUUID(),
      });
    }

    return {
      total: bookedTickets.length,
      items: bookedTickets,
    };
  }
}
