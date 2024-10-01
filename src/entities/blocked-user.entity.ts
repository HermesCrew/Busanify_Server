import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';

@Entity('blocked_user')
export class BlockedUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string; // 차단한 유저의 ID

  @Column()
  blockedUserId: string; // 차단된 유저의 ID

  @CreateDateColumn()
  createdAt: Date;
}
