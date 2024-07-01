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
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('tokensignin')
  async tokenSignIn(@Body('idToken') idToken: string) {
    await this.authService.findOrCreate(idToken);
  }
}
