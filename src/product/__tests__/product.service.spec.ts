import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { ILike, In, Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productEntityMock } from '../__mocks__/product.mock';
import { createProductMock } from '../__mocks__/createProduct.mock';
import { CategoryService } from '../../category/category.service';
import { categoryEntityMock } from '../../category/__mocks__/category.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';

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
            find: jest.fn().mockResolvedValue([productEntityMock]),
            findOne: jest.fn().mockResolvedValue(productEntityMock),
            save: jest.fn().mockResolvedValue(productEntityMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
            findAndCount: jest.fn().mockResolvedValue([[productEntityMock], 1]),
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

  it('should return relations in find all products', async () => {
    const spy = jest.spyOn(productRepository, 'find');
    const products = await service.findAll([], true);

    expect(products).toEqual([productEntityMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      relations: {
        category: true
      }
    })
  });

  it('should return relations and array in find all products', async () => {
    const spy = jest.spyOn(productRepository, 'find');
    const products = await service.findAll([1], true);

    expect(products).toEqual([productEntityMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        id: In([1]),
        
      },
      relations: {
        category: true
      }
    })
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
    const product = await service.createProduct(createProductMock);
    
    expect(product).toEqual(productEntityMock);
  });

  it('should return error if product not exist', async () => {
    jest.spyOn(categoryService, 'findCategoryById').mockRejectedValue(new Error());

    expect(service.createProduct(createProductMock)).rejects.toThrow();
  });

  // Find product by id test
  it('should return product in find by id', async () => {
    const product = await service.findProductById(productEntityMock.id);

    expect(product).toEqual(productEntityMock);
  });

  // Product not found test
  it('should return error in product not found', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findProductById(productEntityMock.id)).rejects.toThrow();
  });

  // Delete product test
  it('should return deleted true in deleted product', async () => {
    const deleted = await service.deleteProduct(productEntityMock.id);

    expect(deleted).toEqual(returnDeleteMock);
  });

  // Update product test
  it('should return product after update', async () => {
    const product = await service.updateProduct(
      createProductMock,
      productEntityMock.id
    );

    expect(product).toEqual(productEntityMock);
  });

  // Update product test
  it('should return error in update product', async () => {
    jest.spyOn(productRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.updateProduct(createProductMock, productEntityMock.id),
    ).rejects.toThrow();
  });

  it('should return product pagination', async () => {
    const spy = jest.spyOn(productRepository, 'findAndCount');
    const productsPagination = await service.findAllPage();

    expect(productsPagination.data).toEqual([productEntityMock]);
    expect(productsPagination.meta).toEqual({
      itemsPerPage: 10,
      totalItems: 1,
      currentPage: 1,
      totalPages: 1
    });

    expect(spy.mock.calls[0][0]).toEqual({
      take: 10,
      skip: 0,
    })
  });

  it('should return product pagination send size and page', async () => {
    const mockSize = 23;
    const mockPage = 233;
    const productsPagination = await service.findAllPage(undefined, mockSize, mockPage);

    expect(productsPagination.data).toEqual([productEntityMock]);
    expect(productsPagination.meta).toEqual({
      itemsPerPage: mockSize,
      totalItems: 1,
      currentPage: mockPage,
      totalPages: 1
    });
  });

  it('should return product pagination search', async () => {
    const mockSearch = 'mockSearch';
    const spy = jest.spyOn(productRepository, 'findAndCount');
    
    await service.findAllPage(mockSearch);

    expect(spy.mock.calls[0][0].where).toEqual({
      name: ILike(`%${mockSearch}%`)
    });
  });
});

