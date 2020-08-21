import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics/analytics.service';
import { AnalyticsResponseDto } from '../dtos/analytics-response.dto';

@Controller('analytics')
export class AnalyticsController {

  constructor(private analytics: AnalyticsService) {
  }

  @Get('popularSeries')
  getPopularSeries(): Promise<AnalyticsResponseDto> {
    return this.analytics.getPopularSeries();
  }
}
