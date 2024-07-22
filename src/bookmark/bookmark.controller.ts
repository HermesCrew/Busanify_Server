import {
  Controller,
  Post,
  Param,
  Get,
  Delete,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { SocialAuthGuard } from 'src/auth/social-auth.guard';
import { User } from 'src/auth/user.decorator';
import { BookmarkEntity } from 'src/entities/bookmark.entity';
import { BookmarkService } from './bookmark.service';

class ToggleBookmarkDto {
  @ApiProperty({ example: 'PLACE_ID' })
  placeId: string;
}

@Controller('bookmarks')
@ApiTags('북마크 API')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(SocialAuthGuard)
  @Post('toggle')
  @ApiOperation({
    summary: '북마크/북마크 취소',
  })
  @ApiBody({ type: ToggleBookmarkDto })
  async toggleBookmark(
    @User() user,
    @Body('placeId') placeId: string,
  ): Promise<BookmarkEntity> {
    return await this.bookmarkService.toggleBookmark(user.sub, placeId);
  }

  @UseGuards(SocialAuthGuard)
  @Get('user')
  @ApiOperation({
    summary: '사용자의 북마크 리스트 조회',
  })
  async getBookmarksByUser(
    @User() user,
    @Query('lang') lang: string,
  ): Promise<any> {
    return await this.bookmarkService.getBookmarksByUser(user.sub, lang);
  }
}
