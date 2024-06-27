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

  // @Get('google/login')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {
  //   console.log('GET google/login - googleAuth 실행');
  // }

  // @Get('oauth2/redirect/google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Req() req, @Res() res) {
  //   console.log('GET oauth2/redirect/google - googleAuthRedirect 실행');

  //   const { user } = req;
  //   const jwt = await this.authService.googleLogin(req);

  //   return res.send(jwt);
  // }

  // @Delete('delete')
  // async deleteAccount(@Body('id') id: number) {
  //   try {
  //     await this.authService.deleteAccount(id);
  //     return { message: '계정이 성공적으로 삭제되었습니다' };
  //   } catch (error) {
  //     return { message: error.message };
  //   }
  // }
}
