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

  async getPosts() {
    const rawPosts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user') // 작성자 정보 포함
      .leftJoin('post.comments', 'comments') // 댓글과 연결
      .addSelect('COUNT(comments.id)', 'commentsCount') // 댓글 개수 선택
      .groupBy('post.id') // 게시글 ID별로 그룹화
      .addGroupBy('user.id') // 유저별 그룹화
      .orderBy('post.createdAt', 'DESC') // 게시글 생성일 내림차순 정렬
      .getRawMany(); // 원시 데이터로 가져옴

    // commentsCount를 포함한 posts 형식으로 변환
    const posts = rawPosts.map((post) => ({
      id: post.post_id,
      content: post.post_content,
      photoUrls: post.post_photoUrls, // 이 필드는 배열로 매핑 필요할 수 있음
      createdAt: post.post_createdAt,
      commentsCount: Number(post.commentsCount), // commentsCount를 Number로 변환
      user: {
        id: post.user_id,
        email: post.user_email,
        nickname: post.user_nickname,
        profileImage: post.user_profileImage,
        provider: post.user_provider,
      },
    }));

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

  async getPostsByUser(userId: string) {
    const rawPosts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user') // 작성자 정보 포함
      .leftJoin('post.comments', 'comments') // 댓글과 연결
      .addSelect('COUNT(comments.id)', 'commentsCount') // 댓글 개수 선택
      .where('user.id = :userId', { userId }) // 특정 유저의 게시글 선택
      .groupBy('post.id') // 게시글 ID별로 그룹화
      .addGroupBy('user.id') // 유저별 그룹화
      .orderBy('post.createdAt', 'DESC') // 게시글 생성일 내림차순 정렬
      .getRawMany(); // 원시 데이터로 가져옴

    // commentsCount를 포함한 posts 형식으로 변환
    const posts = rawPosts.map((post) => ({
      id: post.post_id,
      content: post.post_content,
      photoUrls: post.post_photoUrls, // 이 필드는 배열로 매핑 필요할 수 있음
      createdAt: post.post_createdAt,
      commentsCount: Number(post.commentsCount), // commentsCount를 Number로 변환
      user: {
        id: post.user_id,
        email: post.user_email,
        nickname: post.user_nickname,
        profileImage: post.user_profileImage,
        provider: post.user_provider,
      },
    }));

    return posts;
  }
}
