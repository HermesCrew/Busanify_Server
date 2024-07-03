import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('로그인 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google/tokensignin')
  @ApiOperation({
    summary: '구글 로그인',
  })
  async tokenSignIn(@Body('idToken') idToken: string) {
    await this.authService.findOrCreate(idToken);
  }
}
