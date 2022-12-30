import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SortService } from '../sort/sort.service';
import { SeriesDto } from '../../dtos/series.dto';
import { ResponseDto, ResponseEpisode } from '../../dtos/response.dto';
import { CacheService } from '../cache/cache.service';
import { AnalyticsService } from '../../../analytics/services/analytics/analytics.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { FullSeasonDto } from '../../dtos/full-season.dto';

const CACHE_TTL = 6000;

@Injectable()
export class TopEpisodesService {

  apiBaseUrl = 'https://api.themoviedb.org/3/tv';

  constructor(private sortService: SortService, private cache: CacheService, private analytics: AnalyticsService, private httpService: HttpService) {
  }

  private static checkStatus(res) {
    if (res.status === HttpStatus.OK) {
      return res;
    } else if (res.status === HttpStatus.NOT_FOUND) {
      throw new HttpException('Required resource not found', HttpStatus.NOT_FOUND);
    } else if (res.status === HttpStatus.UNAUTHORIZED) {
      console.error('API KEY NOT SUPPLIED');
      // error not sent to the FE regarding the missing API key, as the developer needs to provide that not the user
      throw new HttpException('Something went wrong! Please contact developer.', HttpStatus.NOT_ACCEPTABLE);
    } else {
      throw new HttpException('Something went wrong!', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  private async getSeasons(seriesId: number, seasonCount: number): Promise<Array<FullSeasonDto>> {
    const all: Array<Promise<FullSeasonDto>> = [];
    for (let i = 1; i <= seasonCount; i++) {
      all.push(this.getSeason(seriesId, i));
    }
    return Promise.all(all).catch(() => {
      throw new HttpException('Something went wrong!', HttpStatus.NOT_ACCEPTABLE);
    });
  }

  private getTopResults(data, count) {
    const sortedByVotes = this.sortService.sortData(data, 'votes');
    return sortedByVotes.slice(-count).reverse();
  }

  private extractEpisodesWithVoteCounts(seasons) {
    let votes = [];
    const episodes = seasons.reduce((acc, item) => {
      votes = votes.concat(item.episodes.map(ep => {
        acc[item.season_number + '-' + ep.episode_number] = ep;
        return { season: item.season_number, ep: ep.episode_number, votes: ep.vote_average };
      }));
      return acc;
    }, {});

    return { episodes, votes };
  }

  private toEpisodesListDto(topResults, episodesObj): ResponseDto {
    const episodes = topResults.reduce((acc: ResponseEpisode[], result) => {
      const key = result.season + '-' + result.ep;
      const { name: episodeName, vote_average: averageVotes } = episodesObj[key];
      return [...acc, { episodeName, averageVotes }];
    }, []);

    return { episodes };
  }

  public async getTvSeries(id: number): Promise<SeriesDto> {
    const cachedData = await this.cache.get('TV_SERIES_' + id);
    if (cachedData) {
      return Promise.resolve(JSON.parse(cachedData));
    }
    const url = this.apiBaseUrl + `/${id}?api_key=${process.env.MOVIEDB_KEY}&language=en-us`;
    return lastValueFrom(this.httpService.get(url))
      .then(TopEpisodesService.checkStatus)
      .then(({ data }) => {
        this.cache.set('TV_SERIES_' + id, JSON.stringify(data), { ttl: CACHE_TTL });
        return data;
      });
  }

  public async getSeason(seriesId: number, seasonNo: number): Promise<FullSeasonDto> {
    const cachedData = await this.cache.get('TV_SERIES_' + seriesId + '_SEASON_' + seasonNo);
    if (cachedData) {
      return Promise.resolve(JSON.parse(cachedData));
    }
    const url = this.apiBaseUrl + `/${seriesId}/season/${seasonNo}?api_key=${process.env.MOVIEDB_KEY}&language=en-US`;
    return lastValueFrom(this.httpService.get(url))
      .then(TopEpisodesService.checkStatus)
      .then(({ data }) => {
        this.cache.set('TV_SERIES_' + seriesId + '_SEASON_' + seasonNo, JSON.stringify(data), { ttl: CACHE_TTL });
        return data;
      });
  }

  public async getTopEpisodes(id: number): Promise<ResponseDto> {
    const series: SeriesDto = await this.getTvSeries(id);
    const seasonsCount = series.number_of_seasons;
    const seasons: FullSeasonDto[] = await this.getSeasons(id, seasonsCount);
    const { episodes, votes } = await this.extractEpisodesWithVoteCounts(seasons);
    const topResults = this.getTopResults(votes, 20);
    this.analytics.incrementAccessCounter(series);
    return this.toEpisodesListDto(topResults, episodes);
  }
}
