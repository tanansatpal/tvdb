import { CacheModule, Module } from '@nestjs/common';
import { TvdbController } from './controllers/tvdb.controller';
import { TopEpisodesService } from './services/top-episodes/top-episodes.service';
import { SortService } from './services/sort/sort.service';
import { CacheService } from './services/cache/cache.service';
import { AnalyticsModule } from '../analytics/analytics.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    CacheModule.register({ ttl: 60 }),
    HttpModule,
    AnalyticsModule,
  ],
  controllers: [TvdbController],
  providers: [TopEpisodesService, SortService, CacheService],
  exports: [CacheService],
})
export class TvdbModule {
}
