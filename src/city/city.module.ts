import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './entities/city.entity';
import { CacheModule as CacheModuleNest} from '@nestjs/cache-manager';
import { CacheModule } from 'src/cache/cache.module';


@Module({
  imports: [CacheModuleNest.register({
    ttl: 900000000,
  }),
    CacheModule, 
    TypeOrmModule.forFeature([CityEntity])
  ],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
