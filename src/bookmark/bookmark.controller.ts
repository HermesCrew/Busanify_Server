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

@Controller('bookmark')
@ApiTags('북마크 API')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(GoogleAuthGuard)
  @Post()
  @ApiOperation({
    summary: '북마크/북마크 취소 API',
  })
  async toggleBookmark(
    @User() user,
    @Body('placeId') placeId: number,
  ): Promise<BookmarkEntity> {
    return await this.bookmarkService.toggleBookmark(user.sub, placeId);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('list')
  @ApiOperation({
    summary: '사용자의 북마크 리스트 조회 API',
  })
  async getUserBookmarks(@User() user): Promise<any> {
    return await this.bookmarkService.getUserBookmarks(user.sub);
  }
}
