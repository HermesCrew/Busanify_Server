import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/entities/review.entity';
import { UserEntity } from 'src/entities/user.entity';
import { PlaceEntity } from 'src/entities/place.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, UserEntity, PlaceEntity]),
    AuthModule,
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
