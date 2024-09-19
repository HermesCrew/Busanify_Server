import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PlaceModule } from './place/place.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { HealthModule } from './health/health.module';
import { ReviewModule } from './review/review.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
    AuthModule,
    PlaceModule,
    BookmarkModule,
    HealthModule,
    ReviewModule,
    ReportModule,
  ],
})
export class AppModule {}
