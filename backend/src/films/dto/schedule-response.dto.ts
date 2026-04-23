import { ScheduleDto } from './schedule.dto';

export class ScheduleResponseDto {
  total: number;
  items: ScheduleDto[];
}
