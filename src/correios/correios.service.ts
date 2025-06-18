import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ReturnCepExternalDto } from './dto/returnCepExternal.dto';
import { CityService } from '../city/city.service';
import { ReturnCepDto } from './dto/returnCep.dto';
import { CityEntity } from '../city/entities/city.entity';
import { Client } from 'nestjs-soap';

@Injectable()
export class CorreiosService {
    URL_CORREIOS = process.env.URL_CEP_CORREIOS;
    constructor(
        @Inject('SOAP_CORREIOS') private readonly soapClient: Client,
        private readonly httpService: HttpService,
        private readonly cityService: CityService
    ) {}

  async findAddressByCep(cep: string): Promise<ReturnCepDto> {
    const returnCep: ReturnCepExternalDto = await this.httpService.axiosRef
        .get<ReturnCepExternalDto>(this.URL_CORREIOS.replace('{CEP}', cep))
        .then((response) => {
            if(response.data.erro === 'true') {
                throw new BadRequestException(
                    `CEP ${cep} not found`,
                );
            }
            return response.data;
        })
        .catch((error) => {
            throw new BadRequestException(
                `Error in connection ${error.message}`,
            );
        });  

        const city: CityEntity | undefined = await this.cityService.findCityAndStateByName(
            returnCep.localidade, 
            returnCep.uf       
        ).catch(() => undefined);

    return new ReturnCepDto(returnCep, city?.id, city?.state?.id);
  };

//   async priceDelivery(): Promise<any> {
//     return new Promise((resolve, reject) => {
//         this.soapClient.CalcPrecoPrazo({
//             nCdServico: '40010',
//             sCepOrigem: '01001-000',
//             sCepDestino: '01001-000',
//             nVlPeso: 1,
//             nCdFormato: 1,
//             nVlComprimento: 16,
//             nVlAltura: 2,
//             nVlLargura: 11,
//             nVlDiametro: 0,
//             sCdMaoPropria: 'N',
//             nVlValorDeclarado: 0,
//             sCdAvisoRecebimento: 'N',
//         }, (err, result) => {
//             if (err) {
//                 return reject(err);
//             }
//             return resolve(result);
//         });
//     });
//   }
}
