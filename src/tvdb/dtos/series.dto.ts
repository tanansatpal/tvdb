import { CrewDto, EpisodeDto } from './episode.dto';
import { SeasonDto } from './season.dto';

class Genre {
  id: number;
  name: string;
}

class Company {
  name: string;
  id: number;
  logo_path: string;
  origin_country: string;
}

export class SeriesDto {
  backdrop_path: string;
  created_by: CrewDto[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: EpisodeDto;
  name: string;
  next_episode_to_air: EpisodeDto;
  networks: Company[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: Company[];
  seasons: SeasonDto[];
  status: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

