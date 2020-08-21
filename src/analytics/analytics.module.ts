import { Module } from '@nestjs/common';
import { AnalyticsController } from './controllers/analytics.controller';
import { AnalyticsService } from './services/analytics/analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEntity } from './entity/analytics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnalyticsEntity]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {
}
