import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { range } from 'rxjs';
import { PlaceEntity } from 'src/entity/place.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(PlaceEntity)
    private placeRepository: Repository<PlaceEntity>,
  ) {}

  async findByTitle(lang: string, title: string): Promise<PlaceEntity[]> {
    if (lang === 'eng') {
      return await this.placeRepository
        .createQueryBuilder('place')
        .where('place.titleEng LIKE :title', { title: `%${title}%` })
        .getMany();
    }
  }
  async findByType(type: string): Promise<PlaceEntity[]> {
    return await this.placeRepository
      .createQueryBuilder('place')
      .where('place.type = :type', { type: type })
      .getMany();
  }
}
