import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PlaceEntity } from 'src/entities/place.entity';
import { OpenAPIService } from './openapi.service';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceEntity]), AuthModule],
  providers: [PlaceService, OpenAPIService],
  controllers: [PlaceController],
})
export class PlaceModule {}
