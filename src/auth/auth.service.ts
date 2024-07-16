import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  // 구글 로그인
  async verifyGoogleIdToken(idToken: string): Promise<any> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException('Invalid ID token');
    }

    return payload;
  }

  async findOrCreate(idToken: string): Promise<UserEntity> {
    const payload = await this.verifyGoogleIdToken(idToken);
    const { sub: id, email, name, picture: profileImage } = payload;

    let user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      user = this.userRepository.create({
        id,
        email,
        name,
        profileImage,
        provider: 'google',
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  // 애플 로그인
  createClientSecret() {
    const teamId = process.env.APPLE_TEAM_ID;
    const subject = process.env.APP_BUNDLE_ID;
    const keyId = process.env.APPLE_KEY_ID;
    const privateKey = fs.readFileSync(
      process.env.APPLE_PRIVATE_KEY_LOCATION,
      'utf-8',
    );

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: teamId,
      iat: now,
      exp: now + 3600,
      aud: 'https://appleid.apple.com',
      sub: subject,
    };

    const header = {
      alg: 'ES256',
      kid: keyId,
    };

    const clientSecret = jwt.sign(payload, privateKey, {
      algorithm: 'ES256',
      header,
    });
    return clientSecret;
  }

  async exchangeCodeToToken(
    authorizationCode: string,
    clientSecret: string,
  ): Promise<any> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: authorizationCode,
      client_secret: clientSecret,
      client_id: process.env.APP_BUNDLE_ID,
    });

    try {
      const response = await axios.post(
        'https://appleid.apple.com/auth/token',
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message,
      );
      throw new Error(`Apple token exchange failed: ${error.message}`);
    }
  }

  generateAccessToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(): string {
    return this.jwtService.sign(
      {},
      { expiresIn: process.env.REFRESH_EXPIRATION_TIME },
    );
  }

  async appleSignIn(authorizationCode: string, userName: string) {
    try {
      const clientSecret = this.createClientSecret();
      const tokenResult = await this.exchangeCodeToToken(
        authorizationCode,
        clientSecret,
      );

      const idToken = tokenResult.id_token;
      const accessToken = tokenResult.access_token;
      const refreshToken = tokenResult.refresh_token;

      const userInfo = this.jwtService.decode(idToken);

      let user = await this.userRepository.findOne({
        where: { id: userInfo.sub },
      });

      if (!user) {
        user = this.userRepository.create({
          id: userInfo.sub,
          email: userInfo.email,
          name: userName,
          profileImage: 'image',
          provider: 'apple',
          refreshToken: refreshToken,
        });
      }

      await this.userRepository.save(user);

      const newAccessToken = this.generateAccessToken(userInfo.sub);
      const newRefreshToken = this.generateRefreshToken();

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new HttpException(`Error -> ${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyAppleAccessToken(accessToken: string): Promise<any> {
    try {
      const payload = await this.jwtService.verify(accessToken);

      if (!payload) {
        throw new UnauthorizedException('Invalid Access token');
      }
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid Apple access token');
    }
  }

  async findById(userId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id: userId },
    });
  }
}
