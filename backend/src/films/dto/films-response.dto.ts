import { FilmDto } from './film.dto';

export class FilmsResponseDto {
  total: number;
  items: FilmDto[];
}
