import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmRepository } from '../repository/film.repository';
import { Film } from '../repository/entities/film.entity';
import { Schedule } from '../repository/entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  controllers: [FilmsController],
  providers: [FilmsService, FilmRepository],
  exports: [FilmRepository],
})
export class FilmsModule {}
