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
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { SocialAuthGuard } from 'src/auth/social-auth.guard';
import { User } from 'src/auth/user.decorator';
import {
  ReviewDeleteDto,
  ReviewDto,
  ReviewUpdateDto,
} from 'src/dto/review.dto';
import { ReviewEntity } from 'src/entities/review.entity';
import { ReviewService } from './review.service';

@Controller('reviews')
@ApiTags('리뷰 API')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(SocialAuthGuard)
  @Post()
  @ApiOperation({
    summary: '리뷰 저장',
  })
  @ApiBody({ type: ReviewDto })
  async createReview(
    @User() user,
    @Body() reviewDto: ReviewDto,
  ): Promise<void> {
    await this.reviewService.createReview(user.sub, reviewDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: '리뷰 조회',
  })
  async getReview(@Param('id') id: number): Promise<ReviewEntity> {
    return await this.reviewService.getReview(id);
  }

  @UseGuards(SocialAuthGuard)
  @Patch()
  @ApiOperation({
    summary: '리뷰 수정',
  })
  @ApiBody({ type: ReviewUpdateDto })
  async updateReview(
    @User() user,
    @Body('id') id: number,
    @Body('rating') rating: number,
    @Body('content') content: string,
    @Body('photoUrls') photoUrls: string[],
  ): Promise<void> {
    await this.reviewService.updateReview(
      user.sub,
      id,
      rating,
      content,
      photoUrls,
    );
  }

  @UseGuards(SocialAuthGuard)
  @Delete()
  @ApiOperation({
    summary: '리뷰 삭제',
  })
  @ApiBody({ type: ReviewDeleteDto })
  async deleteReview(@User() user, @Body('id') id: number): Promise<void> {
    await this.reviewService.deleteReview(user.sub, id);
  }

  @UseGuards(SocialAuthGuard)
  @Get('user/list')
  @ApiOperation({
    summary: '사용자 리뷰 조회',
  })
  async getReviewsByUser(
    @User() user,
    @Query('lang') lang: string,
  ): Promise<any> {
    return await this.reviewService.getReviewsByUser(user.sub, lang);
  }

  @Get('place/:placeId')
  @ApiOperation({
    summary: '장소 리뷰 조회',
  })
  async getReviewsByPlace(@Param('placeId') placeId: string): Promise<any> {
    return await this.reviewService.getReviewsByPlace(placeId);
  }
}
