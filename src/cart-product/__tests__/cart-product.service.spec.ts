import { Test, TestingModule } from '@nestjs/testing';
import { CartProductService } from '../cart-product.service';
import { ProductService } from '../../product/product.service';
import { Repository } from 'typeorm';
import { CartProductEntity } from '../entities/cartProduct.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productEntityMock } from '../../product/__mocks__/product.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { cartEntityMock } from '../../cart/__mocks__/cart.mock';

describe('CartProductService', () => {
  let service: CartProductService;
  let productService: ProductService;
  let cartProductRepository: Repository<CartProductEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: {
            findProductById: jest.fn().mockResolvedValue(productEntityMock)
          }
        },
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: {
            findOne: '',
            save: '',
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          }
        },
        CartProductService,
      ],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
    productService = module.get<ProductService>(ProductService);
    cartProductRepository = module.get<Repository<CartProductEntity>>(
      getRepositoryToken(CartProductEntity));
  });

  // Repository test
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productService).toBeDefined();
    expect(cartProductRepository).toBeDefined();
  });

  // Delete product cart test
  it('should return delete result after delete product', async () => {
    const deleteResult = await service.deleteProductCart(productEntityMock.id, cartEntityMock.id);

    expect(deleteResult).toEqual(returnDeleteMock);
  });

  it('should return error in exception delete', async () => {
    jest.spyOn(cartProductRepository, 'delete').mockRejectedValue(new Error());

    expect(service.deleteProductCart(productEntityMock.id, cartEntityMock.id),
  ).rejects.toThrow()
  });
});
