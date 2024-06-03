import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { range } from 'rxjs';
import { PlaceEntity } from 'src/entity/place.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlaceService {}
