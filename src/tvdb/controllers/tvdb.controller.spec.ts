import { Test, TestingModule } from '@nestjs/testing';
import { TvdbController } from './tvdb.controller';
import { TopEpisodesService } from '../services/top-episodes/top-episodes.service';
import { SortService } from '../services/sort/sort.service';
import { AnalyticsService } from '../../analytics/services/analytics/analytics.service';
import { CacheService } from '../services/cache/cache.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsEntity } from '../../analytics/entity/analytics.entity';
import { CacheModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

describe('Tvdb Controller', () => {
  let controller: TvdbController;
  let topEpisodesService: TopEpisodesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({}), HttpModule],
      controllers: [TvdbController],
      providers: [
        TopEpisodesService,
        SortService,
        AnalyticsService,
        CacheService,
        {
          provide: getRepositoryToken(AnalyticsEntity),
          useValue: {},
        }],
    }).compile();

    controller = module.get<TvdbController>(TvdbController);
    topEpisodesService = module.get<TopEpisodesService>(TopEpisodesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTopEpisodes', () => {
    it('should return the topEpisodes', async () => {
      const result = { episodes: [{ episodeName: 'A', averageVotes: 1.2 }] };
      jest.spyOn(topEpisodesService, 'getTopEpisodes').mockImplementation(() => Promise.resolve(result));
      expect(await controller.getTopEpisodes(123)).toBe(result);
    });
  });
});
