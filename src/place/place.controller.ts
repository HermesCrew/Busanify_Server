import {
  Controller,
  Get,
  Param,
  Body,
  Query,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SocialAuthGuard, OptionalAuthGuard } from 'src/auth/social-auth.guard';
import { User } from 'src/auth/user.decorator';
import { PlaceService } from 'src/place/place.service';
import { OpenAPIService } from './openapi.service';

@Controller('places')
@ApiTags('장소 API')
export class PlaceController {
  constructor(
    private readonly openAPIService: OpenAPIService,
    private readonly placeService: PlaceService,
  ) {}

  @Post('saveshopping')
  @ApiExcludeEndpoint()
  async fetchAndSaveShopping() {
    this.openAPIService.saveFetchData('79');
  }

  @Post('savestay')
  @ApiExcludeEndpoint()
  async fetchAndSaveStay() {
    this.openAPIService.saveFetchData('80');
  }

  @Post('saveattr')
  @ApiExcludeEndpoint()
  async fetchAndSaveAttr() {
    this.openAPIService.saveAttractionService();
  }

  @Post('savefood')
  @ApiExcludeEndpoint()
  async fetchAndSaveBusan() {
    this.openAPIService.saveFoodService();
  }

  @UseGuards(OptionalAuthGuard)
  @Get('searchByType')
  @ApiOperation({
    summary: '장소 타입으로 조회',
    description:
      'typeId(관광지: 76, 쇼핑: 79, 숙박: 80, 음식점: 82)\n lang(eng, jpn, chs, cht)\n lat: 사용자 위도, lng: 사용자 경도, radius: 반경',
  })
  async readByType(
    @User() user,
    @Query('typeId') typeId: string,
    @Query('lang') lang: string,
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius: number,
  ) {
    const userId = user ? user.sub : null;
    return await this.placeService.findByType(
      userId,
      typeId,
      lang,
      lat,
      lng,
      radius,
    );
  }

  @UseGuards(OptionalAuthGuard)
  @Get('searchByTitle')
  @ApiOperation({
    summary: '장소 이름으로 조회',
    description: 'lang(eng, jpn, chs, cht)',
  })
  async readByTitle(
    @User() user,
    @Query('title') title: string,
    @Query('lang') lang: string,
  ) {
    const userId = user ? user.sub : null;
    return await this.placeService.findByTitle(userId, lang, title);
  }

  @Get()
  @ApiOperation({
    summary: '장소 아이디로 조회',
    description: 'lang(eng, jpn, chs, cht)',
  })
  async getById(@Query('id') id: string, @Query('lang') lang: string) {
    return await this.placeService.findById(id, lang);
  }
}
