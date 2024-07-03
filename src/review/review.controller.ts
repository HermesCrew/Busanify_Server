import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleAuth } from 'google-auth-library';
import { GoogleAuthGuard } from 'src/auth/google-auth.guard';
import { User } from 'src/auth/user.decorator';
import { ReviewEntity } from 'src/entities/review.entity';
import { ReviewService } from './review.service';

@Controller('reviews')
@ApiTags('리뷰 API')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(GoogleAuthGuard)
  @Post()
  @ApiOperation({
    summary: '리뷰 저장',
  })
  async createReview(
    @User() user,
    @Body('placeId') placeId: number,
    @Body('rating') rating: number,
    @Body('content') content: string,
    @Body('photos') photos: string[],
  ): Promise<ReviewEntity> {
    return await this.reviewService.createReview(
      user.sub,
      placeId,
      rating,
      content,
      photos,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: '리뷰 조회',
  })
  async getReview(@Param('id') id: number): Promise<ReviewEntity> {
    return await this.reviewService.getReview(id);
  }

  @UseGuards(GoogleAuthGuard)
  @Patch(':id')
  @ApiOperation({
    summary: '리뷰 업데이트',
  })
  async updateReview(
    @User() user,
    @Param('id', ParseIntPipe) id: number,
    @Body('rating') rating: number,
    @Body('content') content: string,
    @Body('photos') photos: string[],
  ): Promise<void> {
    await this.reviewService.updateReview(
      user.sub,
      id,
      rating,
      content,
      photos,
    );
  }

  @UseGuards(GoogleAuthGuard)
  @Delete(':id')
  @ApiOperation({
    summary: '리뷰 삭제',
  })
  async deleteReview(
    @User() user,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.reviewService.deleteReview(user.sub, id);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('user/list')
  @ApiOperation({
    summary: '사용자 리뷰 조회',
  })
  async getReviewsByUser(@User() user): Promise<any> {
    return await this.reviewService.getReviewsByUser(user.sub);
  }

  @Get('place/:placeId')
  @ApiOperation({
    summary: '장소 리뷰 조회',
  })
  async getReviewsByPlace(@Param('placeId') placeId: number): Promise<any> {
    return await this.reviewService.getReviewsByPlace(placeId);
  }
}
