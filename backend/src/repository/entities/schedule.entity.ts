import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column('int')
  hall: number;

  @Column('int')
  rows: number;

  @Column('int')
  seats: number;

  @Column('float')
  price: number;

  @Column('simple-array')
  taken: string[];

  @Column({ type: 'uuid', nullable: true })
  filmId: string | null;

  @ManyToOne(() => Film, (film) => film.schedule, { nullable: true })
  @JoinColumn({ name: 'filmId' })
  film: Film | null;
}
