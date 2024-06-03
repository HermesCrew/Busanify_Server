import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { placeModule } from './place/place.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), placeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
