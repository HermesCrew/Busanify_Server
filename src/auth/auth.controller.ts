import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SocialAuthGuard } from './social-auth.guard';
import { User } from './user.decorator';

class GoogleLoginDto {
  @ApiProperty({ example: 'GOOGLE_ID_TOKEN' })
  idToken: string;
}

class AppleLoginDto {
  @ApiProperty({ example: 'AUTHORIZATION_CODE' })
  authorizationCode: string;

  @ApiProperty({ example: 'USERNAME' })
  username: string;
}

@Controller('auth')
@ApiTags('로그인 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google/signin')
  @ApiOperation({
    summary: '구글 로그인',
  })
  @ApiBody({ type: GoogleLoginDto })
  async tokenSignIn(@Body('idToken') idToken: string) {
    return await this.authService.findOrCreate(idToken);
  }

  @Post('apple/signin')
  @ApiOperation({
    summary: '애플 로그인',
  })
  @ApiBody({ type: AppleLoginDto })
  async appleSignIn(@Body('authorizationCode') authorizationCode: string) {
    return await this.authService.appleSignIn(authorizationCode);
  }

  @Get('profile')
  @UseGuards(SocialAuthGuard)
  async getProfile(@User() user) {
    return await this.authService.findById(user.sub);
  }

  @Patch('updateProfile')
  @UseGuards(SocialAuthGuard)
  @ApiOperation({
    summary: '프로필 업데이트',
  })
  async updateProfile(
    @User() user,
    @Body('profileImage') profileImage?: string,
    @Body('nickname') nickname?: string,
  ) {
    return await this.authService.updateProfile(
      user.sub,
      profileImage,
      nickname,
    );
  }

  @Delete('googleDelete')
  @UseGuards(SocialAuthGuard)
  @ApiOperation({
    summary: '구글 유저 삭제',
  })
  async deleteGoogleUser(@User() user) {
    await this.authService.deleteUser(user.sub);
  }

  @Delete('appleDelete')
  @UseGuards(SocialAuthGuard)
  @ApiOperation({
    summary: '애플유저 삭제',
  })
  async deleteAppleUser(@User() user, @Req() request) {
    await this.authService.deleteUserAndRevokeApple(
      user.sub,
      request.headers['authorization']?.split('Bearer ')[1],
    );
  }
}
