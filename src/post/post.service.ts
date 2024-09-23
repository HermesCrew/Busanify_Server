import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostDto } from 'src/dto/post.dto';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async createPost(userId: string, postDto: PostDto): Promise<void> {
    const { content, photoUrls } = postDto;

    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let post = this.postRepository.create({
      content,
      photoUrls,
      user,
    });

    await this.postRepository.save(post);
  }

  async updatePost(
    userId: string,
    postId: number,
    content: string,
    photoUrls: string[],
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.content = content;
    post.photoUrls = photoUrls;

    await this.postRepository.update(postId, post);
  }

  async deletePost(userId: string, postId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postRepository.delete(postId);
  }

  async getPosts(): Promise<PostEntity[]> {
    const posts = await this.postRepository.find({
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });

    return posts;
  }

  async getPost(postId: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user', 'comments'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async getPostsByUser(userId: string): Promise<PostEntity[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const posts = await this.postRepository.find({
      where: { user: user },
      relations: ['user'],
    });

    return posts;
  }
}
