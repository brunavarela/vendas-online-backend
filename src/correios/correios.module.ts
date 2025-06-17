import { Module } from '@nestjs/common';
import { CorreiosController } from './correios.controller';
import { CorreiosService } from './correios.service';
import { HttpModule } from '@nestjs/axios';
import { CityModule } from '../city/city.module';

@Module({
  imports: [HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CityModule
  ],
  controllers: [CorreiosController],
  providers: [CorreiosService]
})
export class CorreiosModule {}
