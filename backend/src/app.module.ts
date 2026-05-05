import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { Film } from './repository/entities/film.entity';
import { Schedule } from './repository/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST') || 'localhost',
        port: Number(configService.get<string>('DATABASE_PORT')) || 5433,
        database: configService.get<string>('DATABASE_NAME') || 'film_db',
        username: configService.get<string>('DATABASE_USERNAME') || 'film_user',
        password: String(
          configService.get<string>('DATABASE_PASSWORD') || 'film_password',
        ),
        entities: [Film, Schedule],
        synchronize: false,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
      serveStaticOptions: {
        index: false,
        redirect: false,
      },
    }),
    FilmsModule,
    OrderModule,
  ],
  controllers: [],
  providers: [configProvider],
})
export class AppModule {}
