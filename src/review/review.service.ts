import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewForUserDto } from 'src/dto/place.review.dto';
import { ReviewDto } from 'src/dto/review.dto';
import { PlaceEntity } from 'src/entities/place.entity';
import { ReviewEntity } from 'src/entities/review.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PlaceEntity)
    private placeRepository: Repository<PlaceEntity>,
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
  ) {}

  async createReview(userId: string, reviewDto: ReviewDto): Promise<void> {
    const { placeId, rating, content, photoUrls } = reviewDto;

    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    if (!placeId) {
      throw new BadRequestException('placeId is required');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const place = await this.placeRepository.findOne({
      where: { id: placeId },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    let review = this.reviewRepository.create({
      rating,
      content,
      photoUrls,
      user,
      place,
    });

    await this.reviewRepository.save(review);
  }

  async getReview(reviewId: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async updateReview(
    userId: string,
    reviewId: number,
    rating: number,
    content: string,
    photoUrls: string[],
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.rating = rating;
    review.content = content;
    review.photoUrls = photoUrls;

    await this.reviewRepository.update(reviewId, review);
  }

  async deleteReview(userId: string, reviewId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, user: { id: userId } },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewRepository.delete(reviewId);
  }

  async getReviewsByUser(
    userId: string,
    lang: string,
  ): Promise<ReviewForUserDto[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    let selectedColumns = [
      'review.id AS id',
      'review.rating AS rating',
      'review.content AS content',
      'review.photoUrls AS photoUrls',
      'review.createdAt AS createdAt',
      'place.id AS placeId',
      'place.typeId AS typeId',
      'place.image AS placeImage',
      'place.lat AS lat',
      'place.lng AS lng',
      'place.tel AS tel',
      `COALESCE(AVG(review.rating), 0) AS avgRating`,
      'user.id AS userId',
      'user.email AS userEmail',
      'user.nickname AS userNickname',
      'user.profileImage AS userProfileImage',
    ];

    const langColumns: { [key: string]: string[] } = {
      eng: ['place.titleEng AS title', 'place.addressEng AS address'],
      jpn: ['place.titleJpn AS title', 'place.addressJpn AS address'],
      chs: ['place.titleChs AS title', 'place.addressChs AS address'],
      cht: ['place.titleCht AS title', 'place.addressCht AS address'],
    };

    if (langColumns[lang]) {
      selectedColumns = [...selectedColumns, ...langColumns[lang]];
    }

    if (userId) {
      selectedColumns.push('MAX(bookmark.id IS NOT NULL) AS isBookmarked');
    } else {
      selectedColumns.push(`false AS isBookmarked`);
    }

    const results = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoin('review.place', 'place')
      .leftJoin('review.user', 'user')
      .leftJoin(
        'bookmark',
        'bookmark',
        'bookmark.placeId = place.id AND bookmark.userId = :userId',
        { userId },
      ) // bookmark 조인 추가
      .groupBy('review.id')
      .addGroupBy('place.id')
      .addGroupBy('user.id')
      .where('review.user.id = :userId', { userId: user.id })
      .select(selectedColumns)
      .getRawMany();

    const transformedResult = results.map((result) => ({
      id: result.id,
      rating: result.rating,
      content: result.content,
      photoUrls: result.photoUrls,
      createdAt: result.createdAt,
      user: {
        id: result.userId,
        email: result.userEmail,
        nickname: result.userNickname,
        profileImage: result.userProfileImage,
      },
      place: {
        id: result.placeId,
        typeId: result.typeId,
        image: result.placeImage,
        lat: result.lat,
        lng: result.lng,
        tel: result.tel,
        title: result.placeTitle,
        address: result.address,
        isBookmarked: result.isBookmarked,
        avgRating: result.avgRating,
      },
    }));

    return transformedResult;
  }

  async getReviewsByPlace(placeId: string): Promise<ReviewEntity[]> {
    if (!placeId) {
      throw new BadRequestException('placeId is required');
    }

    const place = await this.placeRepository.findOne({
      where: { id: placeId },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .select([
        'review.id',
        'review.rating',
        'review.content',
        'review.photoUrls',
        'review.createdAt',
        'user.id',
        'user.nickname',
        'user.profileImage',
      ])
      .where('review.place.id = :placeId', { placeId: place.id })
      .orderBy('review.createdAt', 'DESC')
      .getMany();
  }
}
