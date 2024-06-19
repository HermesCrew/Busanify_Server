import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { range } from 'rxjs';
import { PlaceEntity } from 'src/entity/place.entity';
import { Double, Repository } from 'typeorm';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(PlaceEntity)
    private placeRepository: Repository<PlaceEntity>,
  ) {}

  // lat, long 으로 필터링 필요
  async findByTitle(lang: string, title: string): Promise<PlaceEntity[]> {
    const commonColumns = [
      'place.id AS id',
      'place.type AS type',
      'place.image AS image',
      'place.latitude AS latitude',
      'place.longitude AS longitude',
      'place.tel AS tel',
    ];

    const langColumns: { [key: string]: string[] } = {
      eng: [
        'place.titleEng AS title',
        'place.addressEng AS address',
        'place.openTimeEng AS openTime',
      ],
      jpn: [
        'place.titleJpn AS title',
        'place.addressJpn AS address',
        'place.openTimeJpn AS openTime',
      ],
      chs: [
        'place.titleChs AS title',
        'place.addressChs AS address',
        'place.openTimeChs AS openTime',
      ],
      cht: [
        'place.titleCht AS title',
        'place.addressCht AS address',
        'place.openTimeCht AS openTime',
      ],
    };

    let selectedColumns = [...commonColumns];

    if (langColumns[lang]) {
      selectedColumns = [...selectedColumns, ...langColumns[lang]];
    }

    return await this.placeRepository
      .createQueryBuilder('place')
      .select(selectedColumns)
      .where('place.titleEng LIKE :title', { title: `%${title}%` })
      .getRawMany();
  }

  async findByType(
    type: string,
    lang: string,
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<PlaceEntity[]> {
    const commonColumns = [
      'place.id AS id',
      'place.type AS type',
      'place.image AS image',
      'place.latitude AS latitude',
      'place.longitude AS longitude',
      'place.tel AS tel',
    ];

    const langColumns: { [key: string]: string[] } = {
      eng: [
        'place.titleEng AS title',
        'place.addressEng AS address',
        'place.openTimeEng AS openTime',
      ],
      jpn: [
        'place.titleJpn AS title',
        'place.addressJpn AS address',
        'place.openTimeJpn AS openTime',
      ],
      chs: [
        'place.titleChs AS title',
        'place.addressChs AS address',
        'place.openTimeChs AS openTime',
      ],
      cht: [
        'place.titleCht AS title',
        'place.addressCht AS address',
        'place.openTimeCht AS openTime',
      ],
    };

    const typeColumns: { [key: string]: { [key: string]: string[] } } = {
      '76': {
        eng: [
          'place.parkingEng AS parking',
          'place.holidayEng AS holiday',
          'place.feeEng AS fee',
        ],
        jpn: [
          'place.parkingJpn AS parking',
          'place.holidayJpn AS holiday',
          'place.feeJpn AS fee',
        ],
        chs: [
          'place.parkingChs AS parking',
          'place.holidayChs AS holiday',
          'place.feeChs AS fee',
        ],
        cht: [
          'place.parkingCht AS parking',
          'place.holidayCht AS holiday',
          'place.feeCht AS fee',
        ],
      },
      '79': {
        eng: [
          'place.parkingEng AS parking',
          'place.holidayEng AS holiday',
          'place.shopguideEng AS shopguide',
          'place.restroom AS restroom',
        ],
        jpn: [
          'place.parkingJpn AS parking',
          'place.holidayJpn AS holiday',
          'place.shopguideJpn AS shopguide',
          'place.restroom AS restroom',
        ],
        chs: [
          'place.parkingChs AS parking',
          'place.holidayChs AS holiday',
          'place.shopguideChs AS shopguide',
          'place.restroom AS restroom',
        ],
        cht: [
          'place.parkingCht AS parking',
          'place.holidayCht AS holiday',
          'place.shopguideCht AS shopguide',
          'place.restroom AS restroom',
        ],
      },
      '80': {
        eng: [
          'place.parkingEng AS parking',
          'place.reservationURL AS reservationURL',
          'place.goodStay AS goodStay',
          'place.hanok AS hanok',
        ],
        jpn: [
          'place.parkingJpn AS parking',
          'place.reservationURL AS reservationURL',
          'place.goodStay AS goodStay',
          'place.hanok AS hanok',
        ],
        chs: [
          'place.parkingChs AS parking',
          'place.reservationURL AS reservationURL',
          'place.goodStay AS goodStay',
          'place.hanok AS hanok',
        ],
        cht: [
          'place.parkingCht AS parking',
          'place.reservationURL AS reservationURL',
          'place.goodStay AS goodStay',
          'place.hanok AS hanok',
        ],
      },
      '82': {
        eng: ['place.menuEng AS menu'],
        jpn: ['place.menuJpn AS menu'],
        chs: ['place.menuChs AS menu'],
        cht: ['place.menuCht AS menu'],
      },
    };

    let selectedColumns = [...commonColumns];

    if (langColumns[lang]) {
      selectedColumns = [...selectedColumns, ...langColumns[lang]];
    }

    if (typeColumns[type] && typeColumns[type][lang]) {
      selectedColumns = [...selectedColumns, ...typeColumns[type][lang]];
    }

    const places = await this.placeRepository
      .createQueryBuilder('place')
      .select(selectedColumns)
      .where('place.type = :type', { type: type })
      .andWhere(
        `ST_Distance_Sphere(
          point(place.longitude, place.latitude),
          point(:longitude, :latitude)
        ) <= :radius`,
        { longitude, latitude, radius },
      )
      .getRawMany();

    console.log(places.length);
    return places;
  }
}
