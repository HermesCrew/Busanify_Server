import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { userInfo } from 'os';
import { SocialAuthGuard } from 'src/auth/social-auth.guard';
import { User } from 'src/auth/user.decorator';
import { CommentDto } from 'src/dto/comment.dto';
import { CommentEntity } from 'src/entities/comment.entity';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(SocialAuthGuard)
  @Post()
  @ApiOperation({
    summary: '댓글 저장',
  })
  @ApiBody({ type: CommentDto })
  async createComment(
    @User() user,
    @Body() commentDto: CommentDto,
  ): Promise<void> {
    await this.commentService.createComment(user.sub, commentDto);
  }

  @Get('post/:id')
  @ApiOperation({
    summary: '게시글의 댓글 불러오기',
  })
  async getComments(@Param('id') postId: number): Promise<CommentEntity[]> {
    return await this.commentService.getCommentsByPost(postId);
  }

  @UseGuards(SocialAuthGuard)
  @Delete()
  @ApiOperation({
    summary: '댓글 삭제',
  })
  async deleteComment(@User() user, @Body('id') id: number): Promise<void> {
    await this.commentService.deleteComment(user.sub, id);
  }
}
