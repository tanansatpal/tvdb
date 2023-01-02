import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Movie } from '../entities/movie.entity';
import { MovieService } from '../services/movie.service';
import { RatingData } from '../entities/rating.entity';

@Resolver(of => Movie)
export class MovieResolver {
  constructor(private movieService: MovieService) {
  }

  @Query(returns => Movie, { name: 'movie' })
  async getMovie(@Args('id', { type: () => Int }) id: number): Promise<Movie> {
    return this.movieService.getMovie(id);
  };

  @Query(returns => [Movie], { name: 'popular' })
  async getPopularMovies(): Promise<Movie[]> {
    return this.movieService.getPopularMovies();
  };


  @Mutation(returns => Boolean)
  async rateMovie(@Args('id', { type: () => Int }) id: number,
                  @Args('ratingData') data: RatingData) {
    return this.movieService.rateMovie(id, data.rating);
  }
}
