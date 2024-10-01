import { Module } from '@nestjs/common';
import { BlockedUserService } from './blocked-user.service';
import { BlockedUserController } from './blocked-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedUserEntity } from 'src/entities/blocked-user.entity';
import { UserEntity } from 'src/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlockedUserEntity, UserEntity]),
    AuthModule,
  ],
  controllers: [BlockedUserController],
  providers: [BlockedUserService],
})
export class BlockedUserModule {}
