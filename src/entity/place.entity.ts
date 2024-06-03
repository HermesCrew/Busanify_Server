import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('place')
export class PlaceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titleEng: string;

  @Column()
  titleJpn: string;

  @Column()
  titleChs: string;

  @Column()
  titleCht: string;

  @Column()
  type: string;

  @Column()
  addressEng: string;

  @Column()
  addressJpn: string;

  @Column()
  addressChs: string;

  @Column()
  addressCht: string;

  @Column()
  firstImage: string;

  @Column()
  secondImage: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  zipcode: string;
}
