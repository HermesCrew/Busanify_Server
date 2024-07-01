import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const idToken = request.headers['authorization']?.split('Bearer ')[1];

    if (!idToken) {
      return false;
    }

    try {
      const payload = await this.authService.verifyIdToken(idToken);
      request.user = payload;
      return true;
    } catch (error) {
      return false;
    }
  }
}
