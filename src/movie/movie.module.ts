import { Module } from '@nestjs/common';
import { MovieController } from './controllers/movie.controller';

@Module({
  imports: [],
  controllers: [MovieController],
  providers: [],
  exports: [],
})
export class MovieModule {
}
