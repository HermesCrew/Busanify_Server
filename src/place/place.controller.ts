import { Controller, Get } from '@nestjs/common';
import { PlaceService } from 'src/place/place.service';
import { OpenAPIService } from './openapi.service';

@Controller('place')
export class PlaceController {
  constructor(private readonly openAPIService: OpenAPIService) {}

  @Get('/save')
  async fetchAndSave() {
    this.openAPIService.saveFetchData();
  }
}
