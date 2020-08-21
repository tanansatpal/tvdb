import { Test, TestingModule } from '@nestjs/testing';
import { TopEpisodesService } from './top-episodes.service';
import { SortService } from '../sort/sort.service';
import { AnalyticsService } from '../../../analytics/services/analytics/analytics.service';
import { CacheService } from '../cache/cache.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsEntity } from '../../../analytics/entity/analytics.entity';
import { CacheModule } from '@nestjs/common';
import fetch from 'node-fetch';
import exp from 'constants';

const { seriesMock } = require('../../../utils/mocks/series.mock');
const { season1Mock } = require('../../../utils/mocks/seasons.mock');
const { topEpisodesMock } = require('../../../utils/mocks/topEpisodes.mock');

jest.mock('node-fetch');

describe('TopEpisodesService', () => {
  let service: TopEpisodesService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({})],
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

    fetch.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call external service to fetch the series data and from cache in next', async done => {
    const seriesResponse = {
      ok: true, json() {
        return Promise.resolve(seriesMock);
      },
    };
    fetch.mockReturnValue(Promise.resolve(seriesResponse));
    const cacheSpy = jest.spyOn(cacheService, 'get').mockReturnValue(Promise.resolve(undefined));
    await service.getTvSeries(123);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch).toHaveBeenCalledWith('https://api.themoviedb.org/3/tv/123?api_key=undefined&language=en-us');
    expect(cacheSpy).toHaveBeenCalledWith('TV_SERIES_123');

    fetch.mockReset();
    cacheSpy.mockClear();

    const cacheSpy2 = jest.spyOn(cacheService, 'get').mockReturnValue(Promise.resolve(JSON.stringify(seriesMock)));
    const series = await service.getTvSeries(123);
    expect(cacheSpy2).toHaveBeenCalledWith('TV_SERIES_123');
    expect(fetch.mock.calls.length).toEqual(0);
    expect(series).toEqual(seriesMock);
    done();
  });

  it('should call external service to fetch the season data', async done => {
    const season1Response = {
      ok: true, json() {
        return Promise.resolve(season1Mock);
      },
    };
    fetch.mockReturnValue(Promise.resolve(season1Response));
    const cacheSpy = jest.spyOn(cacheService, 'get').mockReturnValue(Promise.resolve(undefined));
    await service.getSeason(123, 1);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch).toHaveBeenCalledWith('https://api.themoviedb.org/3/tv/123/season/1?api_key=undefined&language=en-US');
    expect(cacheSpy).toHaveBeenCalledWith('TV_SERIES_123_SEASON_1');
    fetch.mockReset();
    cacheSpy.mockClear();

    const cacheSpy2 = jest.spyOn(cacheService, 'get').mockReturnValue(Promise.resolve(JSON.stringify(season1Mock)));
    await service.getSeason(123, 1);
    expect(cacheSpy2).toHaveBeenCalledWith('TV_SERIES_123_SEASON_1');
    expect(fetch.mock.calls.length).toEqual(0);
    done();
  });

  it('should get topEpisodes', async done => {

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
    done();
  });

  it('should fail with 404 if series not found', async done => {
    fetch.mockReturnValue(Promise.resolve({ status: 404 }));
    await service.getTvSeries(311).catch(error => {
      expect(error.status).toEqual(404);
      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch).toHaveBeenCalledWith('https://api.themoviedb.org/3/tv/311?api_key=undefined&language=en-us');
      done();
    });
  });

  it('should fail with 406 if unknown erro', async done => {
    fetch.mockReturnValue(Promise.resolve({ error: true }));
    await service.getTvSeries(311).catch(error => {
      expect(error.status).toEqual(406);
      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch).toHaveBeenCalledWith('https://api.themoviedb.org/3/tv/311?api_key=undefined&language=en-us');
      done();
    });
  });
});
