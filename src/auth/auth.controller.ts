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
    await this.authService.findOrCreate(idToken);
  }

  @Post('apple/signin')
  @ApiOperation({
    summary: '애플 로그인',
  })
  @ApiBody({ type: AppleLoginDto })
  async appleSignIn(
    @Body('authorizationCode') authorizationCode: string,
    @Body('username') username: string,
  ) {
    return this.authService.appleSignIn(authorizationCode, username);
  }

  @Get('apple/profile')
  @UseGuards(SocialAuthGuard)
  async getAppleProfile(@User() user) {
    return await this.authService.findById(user.sub);
  }
}
