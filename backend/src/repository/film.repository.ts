import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Film, FilmDocument } from './schemas/film.schema';

@Injectable()
export class FilmRepository {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll() {
    return this.filmModel.find().exec();
  }

  async findByFilmId(id: string) {
    return this.filmModel.findOne({ id }).exec();
  }
}
