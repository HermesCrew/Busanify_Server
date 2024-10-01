import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockedUserEntity } from 'src/entities/blocked-user.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlockedUserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(BlockedUserEntity)
    private blockedUserRepository: Repository<BlockedUserEntity>,
  ) {}

  // 차단 기능 구현
  async blockUser(userId: string, blockedUserId: string): Promise<void> {
    // 현재 유저가 존재하는지 확인
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 차단하려는 유저가 존재하는지 확인
    const blockedUser = await this.userRepository.findOne({
      where: { id: blockedUserId },
    });

    if (!blockedUser) {
      throw new NotFoundException('Blocked user not found');
    }

    // 이미 차단된 유저인지 확인
    const isAlreadyBlocked = await this.blockedUserRepository.findOne({
      where: { userId: userId, blockedUserId },
    });

    if (isAlreadyBlocked) {
      throw new BadRequestException('User is already blocked');
    }

    // 차단 엔티티 생성 및 저장
    const blockedEntity = this.blockedUserRepository.create({
      userId: userId,
      blockedUserId,
    });

    await this.blockedUserRepository.save(blockedEntity);
  }
}
