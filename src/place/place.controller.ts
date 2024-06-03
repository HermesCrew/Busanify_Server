import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlaceService } from 'src/place/place.service';
import { OpenAPIService } from './openapi.service';

@Controller('place')
export class PlaceController {
  constructor(
    private readonly openAPIService: OpenAPIService,
    private readonly placeService: PlaceService,
  ) {}

  @Get('/save')
  async fetchAndSave() {
    this.openAPIService.saveFetchData();
  }

  @Get('type/:value')
  async readByType(@Param('value') type: string) {
    return await this.placeService.findByType(type);
  }

  @Get('title')
  async readByTitle(@Query('value') title: string) {
    return await this.placeService.findByTitle('eng', title);
  }
}
