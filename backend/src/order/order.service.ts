import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { FilmRepository } from '../repository/film.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const bookedTickets = [];

    try {
      const requestedPlaces = new Set<string>();

      for (const ticket of dto.tickets) {
        const requestKey = `${ticket.film}:${ticket.session}:${ticket.row}:${ticket.seat}`;

        if (requestedPlaces.has(requestKey)) {
          return { total: 0, items: [] };
        }

        requestedPlaces.add(requestKey);

        const film = await this.filmRepository.findByFilmId(ticket.film);
        if (!film) {
          return { total: 0, items: [] };
        }

        const session = film.schedule.find(
          (schedule) => schedule.id === ticket.session,
        );
        if (!session) {
          return { total: 0, items: [] };
        }

        const place = `${ticket.row}:${ticket.seat}`;
        if (session.taken.includes(place)) {
          return { total: 0, items: [] };
        }

        session.taken.push(place);
        await this.filmRepository.bookPlace(session.id, session.taken);

        bookedTickets.push({
          ...ticket,
          id: randomUUID(),
        });
      }
    } catch {
      return { total: 0, items: [] };
    }

    return {
      total: bookedTickets.length,
      items: bookedTickets,
    };
  }
}
