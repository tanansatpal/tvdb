import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { CACHE_MANAGER, CacheModule } from '@nestjs/common';

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: any;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({})],
      providers: [CacheService],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get<any>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('cache manager should be available', () => {
    expect(cacheManager).toBeDefined();
  });
});
