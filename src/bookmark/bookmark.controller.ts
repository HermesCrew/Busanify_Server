import {
  Controller,
  Post,
  Param,
  Get,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from 'src/auth/google-auth.guard';
import { User } from 'src/auth/user.decorator';
import { BookmarkEntity } from 'src/entities/bookmark.entity';
import { BookmarkService } from './bookmark.service';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(GoogleAuthGuard)
  @Post()
  async bookmarkPlace(
    @User() user,
    @Body('placeId') placeId: number,
  ): Promise<BookmarkEntity> {
    return this.bookmarkService.bookmarkPlace(user.sub, placeId);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('list')
  async getUserBookmarks(@User() user): Promise<any> {
    return this.bookmarkService.getUserBookmarks(user.sub);
  }
}
