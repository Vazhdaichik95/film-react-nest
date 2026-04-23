import { Injectable, NotFoundException } from '@nestjs/common';

import { FilmRepository } from '../repository/film.repository';
import { FilmDto } from './dto/film.dto';
import { FilmsResponseDto } from './dto/films-response.dto';
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleResponseDto } from './dto/schedule-response.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async findAll(): Promise<FilmsResponseDto> {
    const films = await this.filmRepository.findAll();

    return {
      total: films.length,
      items: films.map((film) => this.mapFilmToDto(film)),
    };
  }

  async findSchedule(id: string): Promise<ScheduleResponseDto> {
    const film = await this.filmRepository.findByFilmId(id);

    if (!film) {
      throw new NotFoundException(`Film with id "${id}" not found`);
    }

    return {
      total: film.schedule.length,
      items: film.schedule.map((schedule) => this.mapScheduleToDto(schedule)),
    };
  }

  private mapFilmToDto(film: any): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private mapScheduleToDto(schedule: any): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: String(schedule.hall),
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }
}
