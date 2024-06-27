import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async findOrCreate(idToken: string): Promise<UserEntity> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
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
  // async findByEmailOrSave(
  //   email: string,
  //   fullName: string,
  //   photo: string,
  //   provider: string,
  // ): Promise<UserEntity> {
  //   try {
  //     let user = await this.userRepository.findOne({
  //       where: { email },
  //       withDeleted: true,
  //     });

  //     if (user && user.deletedAt) {
  //       await this.userRepository.restore(user.id);
  //       user = await this.userRepository.findOne({ where: { email } });
  //     }
  //     if (user) return user;

  //     const newUser = this.userRepository.save({
  //       email,
  //       name: fullName,
  //       nickname: fullName,
  //       profileImage: photo,
  //       provider,
  //     });

  //     return newUser;
  //   } catch (error) {
  //     throw new Error('사용자를 찾거나 생성하는데 실패하였습니다');
  //   }
  // }

  // async googleLogin(req): Promise<any> {
  //   const { email, firstName, lastName, photo } = req.user;

  //   const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  //   const user: UserEntity = await this.findByEmailOrSave(
  //     email,
  //     fullName,
  //     photo,
  //     'google',
  //   );

  //   // JWT 토큰에 포함될 payload
  //   const payload = {
  //     id: user.id,
  //     email: user.email,
  //     nickname: user.nickname,
  //     name: user.name,
  //     profileImage: user.profileImage,
  //   };

  //   return {
  //     access_token: this.jwtService.sign(payload, {
  //       expiresIn: process.env.ACCESS_EXPIRATION_TIME,
  //       secret: process.env.ACCESS_SECRET_KEY,
  //     }),
  //   };
  // }

  // async deleteAccount(id: number): Promise<void> {
  //   try {
  //     const user = await this.userRepository.findOne({ where: { id } });

  //     await this.userRepository.softRemove(user);
  //   } catch (error) {
  //     throw new Error('계정 삭제에 실패하였습니다');
  //   }
  // }
}
