import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkEntity } from 'src/entities/bookmark.entity';
import { UserEntity } from 'src/entities/user.entity';
import { PlaceEntity } from 'src/entities/place.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookmarkEntity, UserEntity, PlaceEntity]),
    AuthModule,
  ],
  providers: [BookmarkService],
  controllers: [BookmarkController],
})
export class BookmarkModule {}
