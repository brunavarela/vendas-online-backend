import { Module } from '@nestjs/common';
import { CorreiosController } from './correios.controller';
import { CorreiosService } from './correios.service';
import { HttpModule } from '@nestjs/axios';
import { CityModule } from '../city/city.module';
import { SoapModule } from 'nestjs-soap';

@Module({
  imports: [
    SoapModule.register({ 
      clientName: 'SOAP_CORREIOS', 
      uri: 'https://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl' 
    },),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CityModule
  ],
  controllers: [CorreiosController],
  providers: [CorreiosService]
})
export class CorreiosModule {}
