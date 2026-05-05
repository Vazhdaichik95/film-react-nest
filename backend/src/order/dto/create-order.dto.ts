import { TicketDto } from './ticket.dto';

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}
