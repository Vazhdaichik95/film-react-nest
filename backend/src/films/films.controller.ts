import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll() {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  async findSchedule(@Param('id') id: string) {
    return this.filmsService.findSchedule(id);
  }
}
