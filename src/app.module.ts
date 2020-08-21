import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TvdbModule } from './tvdb/tvdb.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TvdbModule,
    AnalyticsModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.DB_HOST || 'localhost',
      // @ts-ignore
      port: process.env.DB_PORT || 27017,
      database: process.env.DB_NAME || 'tvdb',
      useUnifiedTopology: true,
      useNewUrlParser: true,
      entities: [
        'dist/**/*.entity.js',
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
