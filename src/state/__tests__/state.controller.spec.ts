import { Test, TestingModule } from '@nestjs/testing';
import { StateController } from '../state.controller';
import { StateService } from '../state.service';
import { stateEntityMock } from '../__mocks__/state.mock';

describe('StateController', () => {
  let controller: StateController;
  let stateService: StateService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: StateService,
          useValue: {
            getAllState: jest.fn().mockResolvedValue([stateEntityMock]),
          },
        }
      ],
      controllers: [StateController],
    }).compile();

    controller = module.get<StateController>(StateController);
    stateService = module.get<StateService>(StateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(stateService).toBeDefined();
  });

  it('should return state Entity in getAllState', async () => {
    const state = await controller.getAllState();

    expect(state).toEqual([stateEntityMock]);
  });
});
