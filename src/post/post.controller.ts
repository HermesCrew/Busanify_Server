import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { userInfo } from 'os';
import { OptionalAuthGuard, SocialAuthGuard } from 'src/auth/social-auth.guard';
import { User } from 'src/auth/user.decorator';
import { PostDto } from 'src/dto/post.dto';
import { PostEntity } from 'src/entities/post.entity';
import { PostService } from './post.service';

@Controller('posts')
@ApiTags('커뮤니티 게시글 API')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(SocialAuthGuard)
  @Post()
  @ApiOperation({
    summary: '게시글 저장',
  })
  @ApiBody({ type: PostDto })
  async createPost(@User() user, @Body() postDto: PostDto): Promise<void> {
    await this.postService.createPost(user.sub, postDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get()
  @ApiOperation({
    summary: '게시글 모두 불러오기',
  })
  async getPosts(@User() user) {
    const userId = user ? user.sub : null;
    return await this.postService.getPosts(userId);
  }

  @UseGuards(SocialAuthGuard)
  @Patch()
  @ApiOperation({
    summary: '게시글 수정',
  })
  async updatePost(
    @User() user,
    @Body('id') id: number,
    @Body('content') content: string,
    @Body('photoUrls') photoUrls: string[],
  ): Promise<void> {
    await this.postService.updatePost(user.sub, id, content, photoUrls);
  }

  @UseGuards(SocialAuthGuard)
  @Delete()
  @ApiOperation({
    summary: '게시글 삭제',
  })
  async deletePost(@User() user, @Body('id') id: number): Promise<void> {
    await this.postService.deletePost(user.sub, id);
  }

  @UseGuards(SocialAuthGuard)
  @Get('user/list')
  @ApiOperation({
    summary: '사용자 게시글 조회',
  })
  async getPostsByUser(@User() user) {
    return await this.postService.getPostsByUser(user.sub);
  }
}
