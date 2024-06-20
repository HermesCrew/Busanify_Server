import { Controller, Get, Param, Body, Query, Post } from '@nestjs/common';
import { PlaceService } from 'src/place/place.service';
import { OpenAPIService } from './openapi.service';

@Controller('places')
export class PlaceController {
  constructor(
    private readonly openAPIService: OpenAPIService,
    private readonly placeService: PlaceService,
  ) {}

  @Post('ksave')
  async fetchAndSaveKTO() {
    this.openAPIService.saveFetchData('79');
    this.openAPIService.saveFetchData('80');
  }

  @Post('bsave')
  async fetchAndSaveBusan() {
    this.openAPIService.saveAttractionService();
    // this.openAPIService.saveFoodService();
  }

  @Get('searchByType')
  async readByType(
    @Query('typeId') typeId: string,
    @Query('lang') lang: string,
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius: number,
  ) {
    return await this.placeService.findByType(typeId, lang, lat, lng, radius);
  }

  @Get('searchByTitle')
  async readByTitle(
    @Query('title') title: string,
    @Query('lang') lang: string,
  ) {
    return await this.placeService.findByTitle(lang, title);
  }
}
