import { EpisodeDto } from './episode.dto';

export class FullSeasonDto {
  _id: string;
  air_date: string;
  episodes: EpisodeDto[];
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}
