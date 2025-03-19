import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartProductService } from '../../cart-product/cart-product.service';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { cartEntityMock } from '../__mocks__/cart.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<CartEntity>;
  let cartProductService: CartProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CartProductService,
          useValue: {
            insertProductInCart: jest.fn().mockResolvedValue(undefined),
            deleteProductCart: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProductInCart: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(CartEntity), 
          useValue: {
            save: jest.fn().mockResolvedValue(cartEntityMock),
            findOne: jest.fn().mockResolvedValue(cartEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartProductService = module.get<CartProductService>(CartProductService);
    cartRepository = module.get<Repository<CartEntity>>(getRepositoryToken(CartEntity));
  });

  // Repository test
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartRepository).toBeDefined();
  });

  // clear cart test
  it('should return delete result if delete cart', async () => {
    const spy = jest.spyOn(cartRepository, 'save');

    const resultDelete = await service.clearCart(userEntityMock.id)

    expect(resultDelete).toEqual(returnDeleteMock);
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartEntityMock,
      active: false,
    });
  });
});
