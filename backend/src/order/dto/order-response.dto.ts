import { OrderedTicketDto } from './ordered-ticket.dto';

export class OrderResponseDto {
  total: number;
  items: OrderedTicketDto[];
}
