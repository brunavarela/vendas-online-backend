import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productEntityMock } from '../__mocks__/product.mock';
import { createProduct } from '../__mocks__/createProduct.mock';
import { CategoryService } from '../../category/category.service';
import { categoryEntityMock } from '../../category/__mocks__/category.mock';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService,
        {
          provide: CategoryService,
          useValue: {
            findCategoryById: jest.fn().mockResolvedValue(categoryEntityMock),
          }
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: jest.fn().mockReturnValue([productEntityMock]),
            save: jest.fn().mockReturnValue(productEntityMock)
          }
      }],
    }).compile();

    service = module.get<ProductService>(ProductService);
    categoryService = module.get<CategoryService>(CategoryService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  //Repository Test
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  // Return products test
  it('should return all products', async () => {
    const products = await service.findAll();

    expect(products).toEqual([productEntityMock]);
  });

  // Return error empty products test
  it('should return error if products empty', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValue([]);

    expect(service.findAll()).rejects.toThrow();
  });

  // Exception test
  it('should return error in exception', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAll()).rejects.toThrow();
  });

  // Create product test
  it('should return product after insert in DB', async () => {
    const product = await service.createProduct(createProduct);
    
    expect(product).toEqual(productEntityMock);
  });

  it('should return error if product not exist', async () => {
    jest.spyOn(categoryService, 'findCategoryById').mockRejectedValue(new Error());

    expect(service.createProduct(createProduct)).rejects.toThrow();
  });
});
