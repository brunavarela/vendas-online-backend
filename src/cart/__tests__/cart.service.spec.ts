import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<CartEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
      {
        provide: getRepositoryToken(CartEntity), 
        useValue: {},
      },

      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<CartEntity>>(getRepositoryToken(CartEntity));
  });

  // Repository test
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartRepository).toBeDefined();
  });
});
