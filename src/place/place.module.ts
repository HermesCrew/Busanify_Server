import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceEntity } from 'src/entity/place.entity';
import { OpenAPIService } from './openapi.service';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceEntity])],
  providers: [PlaceService, OpenAPIService],
  controllers: [PlaceController],
})
export class placeModule {}
