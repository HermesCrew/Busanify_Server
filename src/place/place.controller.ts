import { Controller, Get, Param, Body, Query, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlaceEntity } from 'src/entities/place.entity';
import { PlaceService } from 'src/place/place.service';
import { OpenAPIService } from './openapi.service';

@Controller()
@ApiTags('장소 API')
export class PlaceController {
  constructor(
    private readonly openAPIService: OpenAPIService,
    private readonly placeService: PlaceService,
  ) {}

  @Post('places/ksave')
  @ApiOperation({
    summary: '한국관광공사 데이터 저장 API',
  })
  async fetchAndSaveKTO() {
    this.openAPIService.saveFetchData('79');
    this.openAPIService.saveFetchData('80');
  }

  @Post('places/bsave')
  @ApiOperation({
    summary: '부산광역시 데이터 저장 API',
  })
  async fetchAndSaveBusan() {
    this.openAPIService.saveAttractionService();
    this.openAPIService.saveFoodService();
  }

  @Get('places/searchByType')
  @ApiOperation({
    summary: '장소 타입으로 조회 API',
    description:
      'typeId(관광지: 76, 쇼핑: 79, 숙박: 80, 음식점: 82)\n lang(eng, jpn, chs, cht)\n lat: 사용자 위도, lng: 사용자 경도, radius: 반경',
  })
  async readByType(
    @Query('typeId') typeId: string,
    @Query('lang') lang: string,
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius: number,
  ) {
    return await this.placeService.findByType(typeId, lang, lat, lng, radius);
  }

  @Get('places/searchByTitle')
  @ApiOperation({
    summary: '장소 이름으로 조회 API',
    description: 'lang(eng, jpn, chs, cht)',
  })
  async readByTitle(
    @Query('title') title: string,
    @Query('lang') lang: string,
  ) {
    return await this.placeService.findByTitle(lang, title);
  }

  @Get('place')
  @ApiOperation({
    summary: '장소 아이디로 조회 API',
    description: 'lang(eng, jpn, chs, cht)',
  })
  async getById(@Query('id') id: number, @Query('lang') lang: string) {
    return await this.placeService.findById(id, lang);
  }
}
