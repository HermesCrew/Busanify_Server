import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookmarkEntity } from 'src/entities/bookmark.entity';
import { PlaceEntity } from 'src/entities/place.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PlaceEntity)
    private placeRepository: Repository<PlaceEntity>,
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>,
  ) {}

  // async bookmarkPlace(
  //   userId: number,
  //   placeId: number,
  // ): Promise<BookmarkEntity> {
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: {
  //       bookmarks: true,
  //     },
  //   });
  //   const place = await this.placeRepository.findOne({
  //     where: { id: placeId },
  //     relations: {
  //       bookmarks: true,
  //     },
  //   });

  //   if (!user || !place) {
  //     throw new Error('User or Place not found');
  //   }

  //   const bookmark = new BookmarkEntity();
  //   bookmark.user = user;
  //   bookmark.place = place;

  //   return await this.bookmarkRepository.save(bookmark);
  // }

  // async getUserBookmarks(userId: number): Promise<PlaceEntity[]> {
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: {
  //       bookmarks: true,
  //     },
  //   });

  //   if (!user) {
  //     throw new Error('User not found');
  //   }

  //   return user.bookmarks.map((bookmark) => bookmark.place);
  // }

  // async removeBookmark(userId: number, placeId: number): Promise<void> {
  //   await this.bookmarkRepository.delete({
  //     user: { id: userId },
  //     place: { id: placeId },
  //   });
  // }
}
