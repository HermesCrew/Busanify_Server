import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SocialAuthGuard } from './social-auth.guard';
import { User } from './user.decorator';

@Controller('auth')
@ApiTags('로그인 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google/signin')
  @ApiOperation({
    summary: '구글 로그인',
  })
  async tokenSignIn(@Body('idToken') idToken: string) {
    await this.authService.findOrCreate(idToken);
  }

  @Post('apple/signin')
  async appleSignIn(@Body('authorizationCode') authorizationCode: string) {
    return this.authService.appleSignIn(authorizationCode, 'name');
  }

  @Get('apple/profile')
  @UseGuards(SocialAuthGuard)
  async getAppleProfile(@User() user) {
    return await this.authService.findById(user.sub);
  }
}
