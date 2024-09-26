import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentDto } from 'src/dto/comment.dto';
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

  async getCommentsByPost(postId: number): Promise<CommentEntity[]> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comments = await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });

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
