import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { PostEntity } from 'src/entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';
import { BlockedUserEntity } from 'src/entities/blocked-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, UserEntity, BlockedUserEntity]),
    AuthModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
