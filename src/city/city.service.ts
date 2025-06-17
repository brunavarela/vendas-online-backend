import { Injectable, NotFoundException } from '@nestjs/common';
import { CityEntity } from './entities/city.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CityService {

  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,

    private readonly cacheService: CacheService
  ) {}

  async getAllCitiesByStateId(stateId: number): Promise<CityEntity[]> {  
    return this.cacheService.getCache<CityEntity[]>(`state_${stateId}`,
      () => this.cityRepository.find( 
        {
          where: {
            stateId,
          }
        }
      )
    );
  }

  async findCityById(cityId: number): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: {
        id: cityId,
      }
    });

    if (!city) {
      throw new NotFoundException(`CityId: ${cityId} not found`)
    };

    return city;
  }

  async findCityAndStateByName(nameCity: string, nameState: string): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: {
        name: nameCity,
        state: {
          uf: nameState,
        },
      },
      relations: {
        state: true
      },
    });

    if (!city) {
      throw new NotFoundException(`City: ${nameCity} not found in state: ${nameState}`)
    };

    return city;
  }
}


