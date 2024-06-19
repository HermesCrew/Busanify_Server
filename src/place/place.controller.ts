import { Controller, Get, Param, Body, Query, Post } from '@nestjs/common';
import { PlaceService } from 'src/place/place.service';
import { OpenAPIService } from './openapi.service';

@Controller('places')
export class PlaceController {
  constructor(
    private readonly openAPIService: OpenAPIService,
    private readonly placeService: PlaceService,
  ) {}

  @Get('/ksave')
  async fetchAndSaveKTO() {
    this.openAPIService.saveFetchData();
  }

  @Get('bsave')
  async fetchAndSaveBusan() {
    this.openAPIService.saveAttractionService();
    this.openAPIService.saveFoodService();
  }

  @Post('type')
  async readByType(
    @Body('type') type: string,
    @Body('lang') lang: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
    @Body('radius') radius: number,
  ) {
    return await this.placeService.findByType(
      type,
      lang,
      latitude,
      longitude,
      radius,
    );
  }

  @Post('title')
  async readByTitle(@Body('title') title: string, @Body('lang') lang: string) {
    return await this.placeService.findByTitle(lang, title);
  }
}
