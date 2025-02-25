import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CityService } from '../city.service';
import { CityEntity } from '../entities/city.entity';
import { CacheService } from '../../cache/cache.service';
import { cityEntityMock } from '../__mocks__/city.mock';

describe('CityService', () => {
  let service: CityService;
  let cityRepository: Repository<CityEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CityService,
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue([cityEntityMock])
          },  
        },
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cityEntityMock),
          },  
        }
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));
  });

  // Repository Test
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cityRepository).toBeDefined()
  });

  // Find city Test
  it('should return findOne City', async () => {
    const city = await service.findCityById(cityEntityMock.id);

    expect(city).toEqual(cityEntityMock);
  });

  it('should return error findOne not found', async () => {
    jest.spyOn(cityRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findCityById(cityEntityMock.id)).rejects.toThrow(`CityId: ${cityEntityMock.id} not found`)
  });

  // Get city Test
  it('should return Cities in getAllCitiesByStateId', async () => {
    const city = await service.getAllCitiesByStateId(cityEntityMock.id);

    expect(city).toEqual([cityEntityMock])
  });
})
  