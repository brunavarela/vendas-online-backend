import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class CorreiosService {
    URL_CORREIOS = process.env.URL_CEP_CORREIOS;
    constructor(private readonly httpService: HttpService) {}

  async findAddressByCep(cep: string): Promise<AxiosResponse<any>> {
        return this.httpService.axiosRef
        .get(this.URL_CORREIOS.replace('{CEP}', cep))
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
    }
}
