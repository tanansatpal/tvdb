import { Module } from '@nestjs/common';
import { MovieController } from './controllers/movie.controller';
import { MovieResolver } from './resolvers/movie.resolver';
import { MovieService } from './services/movie.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MovieController],
  providers: [MovieResolver, MovieService],
  exports: [],
})
export class MovieModule {
}
