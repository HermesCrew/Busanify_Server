import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { SocialAuthGuard } from 'src/auth/social-auth.guard';
import { User } from 'src/auth/user.decorator';
import { BlockedUserService } from './blocked-user.service';

@Controller('block')
export class BlockedUserController {
  constructor(private readonly blockedUserService: BlockedUserService) {}

  // 유저 차단
  @UseGuards(SocialAuthGuard)
  @Post()
  @ApiOperation({
    summary: '유저 차단',
  })
  async blockUser(
    @User() user, // 현재 로그인한 사용자 정보
    @Body('blockedUserId') blockedUserId: string,
  ): Promise<void> {
    await this.blockedUserService.blockUser(user.sub, blockedUserId);
  }
}
