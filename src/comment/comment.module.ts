import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PostEntity } from 'src/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, UserEntity, PostEntity]),
    AuthModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}