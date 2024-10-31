import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './entities/city.entity';

@Module({
  imports: [CacheModule.register({
    ttl: 900000000,
  }), TypeOrmModule.forFeature([CityEntity])],
  controllers: [CityController],
  providers: [CityService]
})
export class CityModule {}
