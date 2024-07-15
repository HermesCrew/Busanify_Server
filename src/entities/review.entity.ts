import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaceEntity } from './place.entity';
import { UserEntity } from './user.entity';

@Entity('review')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'json', nullable: true })
  photos: string[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  user: UserEntity;

  @ManyToOne(() => PlaceEntity, (place) => place.reviews)
  place: PlaceEntity;
}
