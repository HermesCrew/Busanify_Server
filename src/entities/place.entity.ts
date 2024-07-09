import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { BookmarkEntity } from './bookmark.entity';
import { ReviewEntity } from './review.entity';

@Entity('place')
export class PlaceEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  typeId: string;

  @Column({ type: 'text' })
  titleEng: string;

  @Column({ type: 'text' })
  titleJpn: string;

  @Column({ type: 'text' })
  titleChs: string;

  @Column({ type: 'text' })
  titleCht: string;

  @Column({ type: 'text' })
  addressEng: string;

  @Column({ type: 'text' })
  addressJpn: string;

  @Column({ type: 'text' })
  addressChs: string;

  @Column({ type: 'text' })
  addressCht: string;

  @Column()
  image: string;

  @Column({ type: 'double' })
  lat: number;

  @Column({ type: 'double' })
  lng: number;

  @Column()
  tel: string;

  @Column({ nullable: true })
  openTimeEng: string;

  @Column({ nullable: true })
  openTimeJpn: string;

  @Column({ nullable: true })
  openTimeChs: string;

  @Column({ nullable: true })
  openTimeCht: string;

  @Column({ type: 'text', nullable: true })
  parkingEng: string;

  @Column({ type: 'text', nullable: true })
  parkingJpn: string;

  @Column({ type: 'text', nullable: true })
  parkingChs: string;

  @Column({ type: 'text', nullable: true })
  parkingCht: string;

  @Column({ nullable: true })
  holidayEng: string;

  @Column({ nullable: true })
  holidayJpn: string;

  @Column({ nullable: true })
  holidayChs: string;

  @Column({ nullable: true })
  holidayCht: string;

  @Column({ nullable: true })
  feeEng: string;

  @Column({ nullable: true })
  feeJpn: string;

  @Column({ nullable: true })
  feeChs: string;

  @Column({ nullable: true })
  feeCht: string;

  @Column({ nullable: true })
  menuEng: string;

  @Column({ nullable: true })
  menuJpn: string;

  @Column({ nullable: true })
  menuChs: string;

  @Column({ nullable: true })
  menuCht: string;

  @Column({ type: 'text', nullable: true })
  shopguideEng: string;

  @Column({ type: 'text', nullable: true })
  shopguideJpn: string;

  @Column({ type: 'text', nullable: true })
  shopguideChs: string;

  @Column({ type: 'text', nullable: true })
  shopguideCht: string;

  @Column({ nullable: true })
  reservationURL: string;

  @Column({ nullable: true })
  goodStay: boolean;

  @Column({ nullable: true })
  hanok: boolean;

  @Column({ nullable: true })
  restroom: boolean;

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.place)
  bookmarks: BookmarkEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.place)
  reviews: ReviewEntity[];
}
