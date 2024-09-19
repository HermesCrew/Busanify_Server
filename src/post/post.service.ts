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
    const { title, content, photos } = postDto;

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
      title,
      content,
      photos,
      user,
    });

    await this.postRepository.save(post);
  }

  async updatePost(
    userId: string,
    postId: number,
    title: string,
    content: string,
    photos: string[],
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

    post.title = title;
    post.content = content;
    post.photos = photos;

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
    });

    return posts;
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
