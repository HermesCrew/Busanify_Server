import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('report')
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reportedContentId: number;

  @Column()
  reportedUserId: string;

  @Column()
  currentUserId: string;

  @Column()
  content: string;

  @Column()
  reportType: number;
}
