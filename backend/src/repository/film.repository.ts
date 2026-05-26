import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class FilmRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll() {
    return this.filmRepository.find();
  }

  async findByFilmId(id: string) {
    return this.filmRepository.findOne({
      where: { id },
      relations: {
        schedule: true,
      },
    });
  }

  async bookPlace(sessionId: string, taken: string[]) {
    await this.scheduleRepository.update({ id: sessionId }, { taken });
  }
}
