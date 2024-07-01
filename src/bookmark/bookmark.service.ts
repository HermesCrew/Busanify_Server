import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { AuthService } from 'src/auth/auth.service';
import { BookmarkEntity } from 'src/entities/bookmark.entity';
import { PlaceEntity } from 'src/entities/place.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PlaceEntity)
    private placeRepository: Repository<PlaceEntity>,
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>,
    private readonly authService: AuthService,
  ) {}

  async bookmarkPlace(
    userId: string,
    placeId: number,
  ): Promise<BookmarkEntity> {
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

    let bookmark = await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .where('bookmark.userId = :userId', { userId: user.id })
      .andWhere('bookmark.placeId = :placeId', { placeId: place.id })
      .getOne();

    if (bookmark) {
      bookmark.deleted = !bookmark.deleted;
    } else {
      bookmark = this.bookmarkRepository.create({ user, place });
    }

    return await this.bookmarkRepository.save(bookmark);
  }

  async getUserBookmarks(userId: string): Promise<PlaceEntity[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const bookmarks = await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .leftJoinAndSelect('bookmark.place', 'place')
      .where('bookmark.user.id = :userId', { userId: user.id })
      .andWhere('bookmark.deleted = false')
      .getMany();

    return bookmarks.map((bookmark) => bookmark.place);
  }
}
