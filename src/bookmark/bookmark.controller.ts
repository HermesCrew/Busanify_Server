import {
  Controller,
  Post,
  Param,
  Get,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from 'src/auth/google-auth.guard';
import { User } from 'src/auth/user.decorator';
import { BookmarkEntity } from 'src/entities/bookmark.entity';
import { BookmarkService } from './bookmark.service';

@Controller('bookmarks')
@ApiTags('북마크 API')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(GoogleAuthGuard)
  @Post('toggle')
  @ApiOperation({
    summary: '북마크/북마크 취소',
  })
  async toggleBookmark(
    @User() user,
    @Body('placeId') placeId: number,
  ): Promise<BookmarkEntity> {
    return await this.bookmarkService.toggleBookmark(user.sub, placeId);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('user')
  @ApiOperation({
    summary: '사용자의 북마크 리스트 조회',
  })
  async getBookmarksByUser(@User() user): Promise<any> {
    return await this.bookmarkService.getBookmarksByUser(user.sub);
  }
}
