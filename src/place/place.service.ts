import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { range } from 'rxjs';
import { PlaceEntity } from 'src/entities/place.entity';
import { Double, Repository } from 'typeorm';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(PlaceEntity)
    private placeRepository: Repository<PlaceEntity>,
  ) {}

  async findById(
    userId: string | null,
    id: string,
    lang: string,
  ): Promise<PlaceEntity> {
    const place = await this.placeRepository.findOne({
      where: { id: id },
    });

    const commonColumns = [
      'place.id AS id',
      'place.typeId AS typeId',
      'place.image AS image',
      'place.lat AS lat',
      'place.lng AS lng',
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

    if (typeColumns[place.typeId] && typeColumns[place.typeId][lang]) {
      selectedColumns = [
        ...selectedColumns,
        ...typeColumns[place.typeId][lang],
      ];
    }

    if (userId) {
      selectedColumns.push('MAX(bookmark.id IS NOT NULL) AS isBookmarked');
    } else {
      selectedColumns.push(`false AS isBookmarked`);
    }

    selectedColumns.push(
      'review.id AS reviewId',
      'review.rating AS reviewRating',
      'review.content AS reviewContent',
      'review.photos AS reviewPhotos',
      'review.createdAt AS reviewCreatedAt',
      'user.id AS reviewUserId',
      'user.nickname AS reviewUserNickname',
      'user.profileImage AS reviewUserProfileImage',
    );

    const avgRatingQuery = this.placeRepository
      .createQueryBuilder('place')
      .select([
        'place.id AS id',
        `COALESCE(AVG(review.rating), 0) AS avgRating`,
      ])
      .leftJoin('review', 'review', 'review.placeId = place.id')
      .where('place.id = :id', { id: id })
      .groupBy('place.id');

    const avgRatingResult = await avgRatingQuery.getRawOne();

    const queryBuilder = this.placeRepository
      .createQueryBuilder('place')
      .select(selectedColumns)
      .leftJoin('review', 'review', 'review.placeId = place.id')
      .leftJoin('user', 'user', 'review.userId = user.id')
      .groupBy('place.id, review.id, user.id')
      .orderBy('review.createdAt', 'DESC');

    if (userId) {
      queryBuilder.leftJoin(
        'bookmark',
        'bookmark',
        'bookmark.placeId = place.id AND bookmark.userId = :userId AND bookmark.deleted = false',
        { userId: userId },
      );
    }

    const result = await queryBuilder
      .where('place.id = :id', { id: id })
      .getRawMany();

    const transformedResult = {
      ...result[0],
      avgRating: parseFloat(parseFloat(avgRatingResult.avgRating).toFixed(2)),
      isBookmarked: Boolean(Number(result[0].isBookmarked)),
      reviews: result[0]?.reviewId
        ? result.map((r) => ({
            id: r.reviewId,
            rating: r.reviewRating,
            content: r.reviewContent,
            photos: r.reviewPhotos,
            user: {
              id: r.reviewUserId,
              nickname: r.reviewUserNickname,
              profileImage: r.reviewUserProfileImage,
            },
            createdAt: r.reviewCreatedAt,
          }))
        : [],
    };

    delete transformedResult.reviewId;
    delete transformedResult.reviewRating;
    delete transformedResult.reviewContent;
    delete transformedResult.reviewPhotos;
    delete transformedResult.reviewUserId;
    delete transformedResult.reviewUsername;
    delete transformedResult.reviewUserProfileImage;
    delete transformedResult.reviewCreatedAt;

    return transformedResult;
  }

  // lat, long 으로 필터링 필요
  async findByTitle(
    userId: string | null,
    lang: string,
    title: string,
  ): Promise<PlaceEntity[]> {
    const commonColumns = [
      'place.id AS id',
      'place.typeId AS typeId',
      'place.image AS image',
      'place.lat AS lat',
      'place.lng AS lng',
      'place.tel AS tel',
      `COALESCE(AVG(review.rating), 0) AS avgRating`,
      'COUNT(review.id) AS reviewCount',
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

    if (userId) {
      selectedColumns.push('MAX(bookmark.id IS NOT NULL) AS isBookmarked');
    } else {
      selectedColumns.push(`false AS isBookmarked`);
    }

    const queryBuilder = this.placeRepository
      .createQueryBuilder('place')
      .select(selectedColumns)
      .leftJoin('review', 'review', 'review.placeId = place.id')
      .groupBy('place.id');

    if (userId) {
      queryBuilder.leftJoin(
        'bookmark',
        'bookmark',
        'bookmark.placeId = place.id AND bookmark.userId = :userId AND bookmark.deleted = false',
        { userId: userId },
      );
    }
    const results = await queryBuilder
      .where('place.titleEng LIKE :title', { title: `%${title}%` })
      .getRawMany();

    return results.map((result) => ({
      ...result,
      avgRating: parseFloat(parseFloat(result.avgRating).toFixed(2)),
      isBookmarked: Boolean(Number(result.isBookmarked)),
      reviewCount: parseInt(result.reviewCount),
    }));
  }

  async findByType(
    userId: string | null,
    typeId: string,
    lang: string,
    lat: number,
    lng: number,
    radius: number,
  ): Promise<PlaceEntity[]> {
    const commonColumns = [
      'place.id AS id',
      'place.typeId AS typeId',
      'place.image AS image',
      'place.lat AS lat',
      'place.lng AS lng',
      'place.tel AS tel',
      `COALESCE(AVG(review.rating), 0) AS avgRating`,
      'COUNT(review.id) AS reviewCount',
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

    if (typeColumns[typeId] && typeColumns[typeId][lang]) {
      selectedColumns = [...selectedColumns, ...typeColumns[typeId][lang]];
    }

    if (userId) {
      selectedColumns.push('MAX(bookmark.id IS NOT NULL) AS isBookmarked');
    } else {
      selectedColumns.push(`false AS isBookmarked`);
    }

    const queryBuilder = this.placeRepository
      .createQueryBuilder('place')
      .select(selectedColumns)
      .leftJoin('review', 'review', 'review.placeId = place.id')
      .groupBy('place.id');

    if (userId) {
      queryBuilder.leftJoin(
        'bookmark',
        'bookmark',
        'bookmark.placeId = place.id AND bookmark.userId = :userId AND bookmark.deleted = false',
        { userId: userId },
      );
    }

    const results = await queryBuilder
      .where('place.typeId = :typeId', { typeId: typeId })
      .andWhere(
        `ST_Distance_Sphere(
          point(place.lng, place.lat),
          point(:lng, :lat)
        ) <= :radius`,
        { lng, lat, radius },
      )
      .getRawMany();

    return results.map((result) => ({
      ...result,
      avgRating: parseFloat(parseFloat(result.avgRating).toFixed(2)),
      isBookmarked: Boolean(Number(result.isBookmarked)),
      reviewCount: parseInt(result.reviewCount),
    }));
  }
}
