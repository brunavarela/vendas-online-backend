import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnCepExternalDto } from './dto/returnCepExternal.dto';
import { CityService } from 'src/city/city.service';
import { ReturnCepDto } from './dto/returnCep.dto';
import { CityEntity } from 'src/city/entities/city.entity';

@Injectable()
export class CorreiosService {
    URL_CORREIOS = process.env.URL_CEP_CORREIOS;
    constructor(private readonly httpService: HttpService,
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
}
