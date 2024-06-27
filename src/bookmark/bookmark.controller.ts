import { Controller, Post, Param, Get, Delete } from '@nestjs/common';
import { BookmarkEntity } from 'src/entities/bookmark.entity';
import { BookmarkService } from './bookmark.service';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  // @Post(':userId/places/:placeId')
  // async bookmarkPlace(
  //   @Param('userId') userId: number,
  //   @Param('placeId') placeId: number,
  // ): Promise<BookmarkEntity> {
  //   return this.bookmarkService.bookmarkPlace(userId, placeId);
  // }

  // @Get(':userId')
  // async getUserBookmarks(@Param('userId') userId: number): Promise<any> {
  //   return this.bookmarkService.getUserBookmarks(userId);
  // }

  // @Delete(':userId/places/:placeId')
  // async removeBookmark(
  //   @Param('userId') userId: number,
  //   @Param('placeId') placeId: number,
  // ): Promise<void> {
  //   return this.bookmarkService.removeBookmark(userId, placeId);
  // }
}
