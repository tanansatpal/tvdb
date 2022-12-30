import { Test, TestingModule } from '@nestjs/testing';
import { TopEpisodesService } from './top-episodes.service';
import { SortService } from '../sort/sort.service';
import { AnalyticsService } from '../../../analytics/services/analytics/analytics.service';
import { CacheService } from '../cache/cache.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsEntity } from '../../../analytics/entity/analytics.entity';
import { CacheModule } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

import seriesMock from '../../../utils/mocks/series.mock';
import { season1Mock } from '../../../utils/mocks/seasons.mock';
import topEpisodesMock from '../../../utils/mocks/topEpisodes.mock';

describe('TopEpisodesService', () => {
  let service: TopEpisodesService;
  let cacheService: CacheService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({}), HttpModule],
      providers: [
        TopEpisodesService,
        SortService,
        CacheService,
        {
          provide: getRepositoryToken(AnalyticsEntity),
          useValue: {},
        },
        {
          provide: AnalyticsService,
          useClass: class {
            incrementAccessCounter() {
            }
          },
        },
      ],
    }).compile();

    service = module.get<TopEpisodesService>(TopEpisodesService);
    cacheService = module.get<CacheService>(CacheService);
    httpService = module.get<HttpService>(HttpService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call external service to fetch the series data and from cache in next', async () => {
    const seriesResponse = {
      status: 200,
      statusText: '',
      headers: {},
      config: {},
      data: seriesMock,
    };
    const cacheSpy = jest.spyOn(cacheService, 'get').mockReturnValue(Promise.resolve(undefined));
    const httpSpy = jest.spyOn(httpService, 'get').mockReturnValue(of(seriesResponse));
    await service.getTvSeries(123);
    expect(httpSpy.mock.calls.length).toEqual(1);
    expect(httpService.get).toHaveBeenCalledWith('https://api.themoviedb.org/3/tv/123?api_key=undefined&language=en-us');
    expect(cacheSpy).toHaveBeenCalledWith('TV_SERIES_123');

    httpSpy.mockClear();
    cacheSpy.mockClear();

    const cacheSpy2 = jest.spyOn(cacheService, 'get').mockReturnValue(Promise.resolve(JSON.stringify(seriesMock)));
    const series = await service.getTvSeries(123);
    expect(cacheSpy2).toHaveBeenCalledWith('TV_SERIES_123');
    expect(httpSpy.mock.calls.length).toEqual(0);
    expect(series).toEqual(seriesMock);
  });

  it('should call external service to fetch the season data', async () => {
    const season1Response = {
      status: 200,
      statusText: '',
      headers: {},
      config: {},
      data: season1Mock,
    };
    const cacheSpy = jest.spyOn(cacheService, 'get').mockReturnValue(Promise.resolve(undefined));
    const httpSpy = jest.spyOn(httpService, 'get').mockReturnValue(of(season1Response));
    await service.getSeason(123, 1);
    expect(httpSpy.mock.calls.length).toEqual(1);
    expect(httpService.get).toHaveBeenCalledWith('https://api.themoviedb.org/3/tv/123/season/1?api_key=undefined&language=en-US');
    expect(cacheSpy).toHaveBeenCalledWith('TV_SERIES_123_SEASON_1');
    httpSpy.mockReset();
    cacheSpy.mockClear();

    const cacheSpy2 = jest.spyOn(cacheService, 'get').mockReturnValue(Promise.resolve(JSON.stringify(season1Mock)));
    await service.getSeason(123, 1);
    expect(cacheSpy2).toHaveBeenCalledWith('TV_SERIES_123_SEASON_1');
    expect(httpSpy.mock.calls.length).toEqual(0);
  });

  it('should get topEpisodes', async () => {

    const tvSeriesSpy = jest.spyOn(service, 'getTvSeries').mockReturnValue(Promise.resolve(seriesMock));
    const seasonSpy = jest.spyOn(service, 'getSeason').mockReturnValue(Promise.resolve(season1Mock));

    const topEpisodes = await service.getTopEpisodes(123);
    expect(tvSeriesSpy).toHaveBeenCalledWith(123);
    expect(seasonSpy.mock.calls.length).toEqual(2);
    expect(seasonSpy.mock.calls).toEqual([
      [123, 1],
      [123, 2],
    ]);
    expect(topEpisodes.episodes).toEqual(topEpisodesMock);
  });

  it('should fail with 404 if series not found', async () => {
    const NotFoundRes = {
      status: 404,
      statusText: '',
      headers: {},
      config: {},
      data: {},
    };
    const httpSpy = jest.spyOn(httpService, 'get').mockReturnValue(of(NotFoundRes));
    await service.getTvSeries(311).catch(error => {
      expect(error.status).toEqual(404);
      expect(httpSpy.mock.calls.length).toEqual(1);
      expect(httpService.get).toHaveBeenCalledWith('https://api.themoviedb.org/3/tv/311?api_key=undefined&language=en-us');
    });
  });

  it('should fail with 406 if unknown erro', async () => {
    const NotFoundRes = {
      status: 500,
      statusText: '',
      headers: {},
      config: {},
      data: {},
      error: true,
    };
    const httpSpy = jest.spyOn(httpService, 'get').mockReturnValue(of(NotFoundRes));
    await service.getTvSeries(311).catch(error => {
      expect(error.status).toEqual(406);
      expect(httpSpy.mock.calls.length).toEqual(1);
      expect(httpService.get).toHaveBeenCalledWith('https://api.themoviedb.org/3/tv/311?api_key=undefined&language=en-us');
    });
  });
});
