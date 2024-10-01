import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookmarkEntity } from './bookmark.entity';
import { CommentEntity } from './comment.entity';
import { PostEntity } from './post.entity';
import { ReviewEntity } from './review.entity';
import { BlockedUserEntity } from './blocked-user.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ default: 'none' })
  provider: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  // @Exclude({ toPlainOnly: true })
  refreshToken: string;

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.user)
  bookmarks: BookmarkEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity[];

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];
}
