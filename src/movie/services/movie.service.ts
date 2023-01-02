import { Injectable } from '@nestjs/common';
import { Movie } from '../entities/movie.entity';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MovieService {
  apiBaseUrl = 'https://api.themoviedb.org/3/movie';

  constructor(private httpService: HttpService) {
  }

  public async getMovie(id: number): Promise<Movie> {
    const url = this.apiBaseUrl + `/${id}?api_key=${process.env.MOVIEDB_KEY}&language=en-us`;
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data;
  }

  public async getPopularMovies(): Promise<Movie[]> {
    const url = this.apiBaseUrl + `/popular?api_key=${process.env.MOVIEDB_KEY}&language=en-us`;
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data.results;
  }

  public async rateMovie(id: number, value: number): Promise<void> {
    const url = this.apiBaseUrl + `/${id}/rating?api_key=${process.env.MOVIEDB_KEY}`;
    // todo: create guest session first
    const response = await lastValueFrom(this.httpService.post(url, { value }));
    console.log(response);
  }
}
