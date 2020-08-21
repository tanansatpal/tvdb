import { Test, TestingModule } from '@nestjs/testing';
import { TopEpisodesService } from './top-episodes.service';

describe('TopEpisodesService', () => {
  let service: TopEpisodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopEpisodesService],
    }).compile();

    service = module.get<TopEpisodesService>(TopEpisodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
