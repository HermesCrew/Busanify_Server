import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlaceEntity } from './place.entity';
import { UserEntity } from './user.entity';

@Entity('bookmark')
export class BookmarkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.bookmarks)
  user: UserEntity;

  @ManyToOne(() => PlaceEntity, (place) => place.bookmarks)
  place: PlaceEntity;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
