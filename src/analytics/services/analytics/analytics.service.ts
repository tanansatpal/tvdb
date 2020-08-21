import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalyticsEntity } from '../../entity/analytics.entity';
import { MongoRepository } from 'typeorm/index';

@Injectable()
export class AnalyticsService {

  constructor(@InjectRepository(AnalyticsEntity)
              private readonly analyticsRepo: MongoRepository<AnalyticsEntity>) {
  }

  private static toAnalyticsResponseDto(data: AnalyticsEntity[]) {
    const series = data.map(item => {
      const { seriesName, accessCount } = item;
      return { seriesName, accessCount };
    });

    return { series };
  }

  async getPopularSeries(): Promise<any> {
    const response = await this.analyticsRepo.createCursor().sort({ accessCount: -1 }).limit(5).toArray();
    return AnalyticsService.toAnalyticsResponseDto(response);
  }

  async incrementAccessCounter({ name }): Promise<void> {
    await this.analyticsRepo.findOneAndUpdate({ seriesName: name }, { $inc: { accessCount: 1 } }, { upsert: true });
  }
}
