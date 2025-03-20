import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from '../city.controller';
import { CityService } from '../city.service';
import { cityEntityMock } from '../__mocks__/city.mock';
import { stateEntityMock } from '../../state/__mocks__/state.mock';

describe('CityController', () => {
  let controller: CityController;
  let cityService: CityService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CityService,
          useValue: {
            getAllCitiesByStateId: jest.fn().mockResolvedValue([cityEntityMock]),
          },
        }
      ],
      controllers: [CityController],
    }).compile();

    controller = module.get<CityController>(CityController);
    cityService = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(cityService).toBeDefined();
  });

  it('should return city entity in getAllCitiesByStateId', async () => {
    const city = await controller.getAllCitiesByStateId(stateEntityMock.id);

    expect(city).toEqual([cityEntityMock]);
  });
});
