import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { placeModule } from './place/place.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), placeModule],
})
export class AppModule {}
