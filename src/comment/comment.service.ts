import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentDto } from 'src/dto/comment.dto';
import { BlockedUserEntity } from 'src/entities/blocked-user.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(BlockedUserEntity)
    private blockedUserRepository: Repository<BlockedUserEntity>,
  ) {}

  async createComment(userId, commentDto: CommentDto): Promise<void> {
    const { postId, content } = commentDto;

    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    if (!postId) {
      throw new BadRequestException('postId is required');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let comment = this.commentRepository.create({
      content,
      user,
      post,
    });

    await this.commentRepository.save(comment);
  }

  async getCommentsByPost(
    postId: number,
    userId?: string,
  ): Promise<CommentEntity[]> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let blockedUserIds: string[] = [];

    // userId가 있을 경우에만 차단한 유저 목록을 조회
    if (userId) {
      const blockedUsers = await this.blockedUserRepository
        .createQueryBuilder('blocked_user')
        .select('blocked_user.blockedUserId')
        .where('blocked_user.userId = :userId', { userId })
        .getMany();

      // 차단된 유저들의 ID 배열 생성
      blockedUserIds = blockedUsers.map((blocked) => blocked.blockedUserId);
    }

    // 댓글 조회 시 차단된 유저의 댓글은 제외
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.postId = :postId', { postId });

    // 차단된 유저가 있으면 차단된 유저의 댓글을 제외하는 조건 추가
    if (blockedUserIds.length > 0) {
      queryBuilder.andWhere('user.id NOT IN (:...blockedUserIds)', {
        blockedUserIds,
      });
    }

    const comments = await queryBuilder.getMany();

    return comments;
  }

  async deleteComment(userId, commentId): Promise<void> {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentRepository.delete(commentId);
  }
}
