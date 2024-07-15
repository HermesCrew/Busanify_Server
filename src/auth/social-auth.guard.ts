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
export class SocialAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      let payload;

      try {
        payload = await this.authService.verifyGoogleIdToken(token);
      } catch (googleError) {
        try {
          payload = await this.authService.verifyAppleAccessToken(token);
        } catch (appleError) {
          throw new UnauthorizedException('Invalid token');
        }
      }
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split('Bearer ')[1];

    if (!token) {
      return true;
    }

    try {
      let payload;

      try {
        payload = await this.authService.verifyGoogleIdToken(token);
      } catch (googleError) {
        try {
          payload = await this.authService.verifyAppleAccessToken(token);
        } catch (appleError) {
          return true;
        }
      }
      request.user = payload;
      return true;
    } catch (error) {
      return true;
    }
  }
}
