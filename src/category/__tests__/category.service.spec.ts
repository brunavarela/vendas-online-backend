import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryEntityMock } from '../__mocks__/category.mock';
import { createCategoryMock } from '../__mocks__/createCategory.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { ProductService } from '../../product/product.service';
import { countProductMock } from '../../product/__mocks__/countProduct.mock';
import { ReturnCategory } from '../dtos/returnCategory.dto';
import { productEntityMock } from '../../product/__mocks__/product.mock';
import { BadRequestException } from '@nestjs/common';
import { updateCategoryMock } from '../__mocks__/updateCategory.mock';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: ProductService,
          useValue: {
            countProductsByCategoryId: jest.fn().mockResolvedValue([countProductMock]),
          }
        }, 
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(categoryEntityMock),
            find: jest.fn().mockResolvedValue([categoryEntityMock]),
            save: jest.fn().mockResolvedValue(categoryEntityMock),
            delete: jest.fn().mockReturnValue(returnDeleteMock),
          }
      }],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    productService = module.get<ProductService>(ProductService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity));
  });

  // Repository Test
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productService).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  // List categories Test
  it('should return list category', async () => {
    const categories = await service.findAllCategories();

    expect(categories).toEqual([
      new ReturnCategory(categoryEntityMock, countProductMock.total)
    ])
  });

  // Error list category empty Test
  it('should return error in list category empty', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);
    
    expect(service.findAllCategories()).rejects.toThrow()
  });

  // Error list category exception Test
  it('should return error in list category exception', async () => {
    jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error())

    expect(service.findAllCategories()).rejects.toThrow()
  });

  // Create category Test
  it('should return error if exists category name', async () => {    
    expect(service.createCategory(createCategoryMock)).rejects.toThrow();
  });

  it('should return category after save', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    const category = await service.createCategory(createCategoryMock);

    expect(category).toEqual(categoryEntityMock);
  });

  it('should return error in exception', async () => {
    jest.spyOn(categoryRepository, 'save').mockRejectedValue(new Error());
    
    expect(service.createCategory(createCategoryMock)).rejects.toThrow();
  });

  // find category by name test
  it('should return category in find by name', async () => {
    const category = await service.findCategoryByName(categoryEntityMock.name);

    expect(category).toEqual(categoryEntityMock);
  });
  
  // find category by name not exist test
  it('should return error if category find by name empty', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockReturnValue(undefined);

    expect(service.findCategoryByName(categoryEntityMock.name)).rejects.toThrow();
  });

  // find category by id test
  it('should return category in find by id', async () => {
    const category = await service.findCategoryById(categoryEntityMock.id);

    expect(category).toEqual(categoryEntityMock)
  });

  // find category by id not exist test
  it('should return error in not found categoryId', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);
    
    expect(service.findCategoryById(categoryEntityMock.id)).rejects.toThrow();
  });

  // Delete category test
  it('should return deleted true in deleted product', async () => {
    const deleted = await service.deleteCategory(categoryEntityMock.id);

    expect(deleted).toEqual(returnDeleteMock);
  });

  it('should send relations in request findOne', async () => {
    const spy = jest.spyOn(categoryRepository, 'findOne');
    const deleted = await service.deleteCategory(categoryEntityMock.id);

    expect(deleted).toEqual(returnDeleteMock);
    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        id: categoryEntityMock.id,
      },
      relations: { 
        products: true 
      },
    });
  });

  it('should return error if category with relations', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue({
      ...categoryEntityMock,
      products: [productEntityMock],
    }); 

    expect(service.deleteCategory(categoryEntityMock.id)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return category in update category', async () => {
    const spy = jest.spyOn(categoryRepository, 'findOne');
    const category = await service.editCategory(
      categoryEntityMock.id, 
      updateCategoryMock
    );

    expect(category).toEqual(categoryEntityMock);
    expect(spy.mock.calls.length > 0).toEqual(true);
  });

  it('should send new category to save', async () => {
    const spy = jest.spyOn(categoryRepository, 'save');
     await service.editCategory(
      categoryEntityMock.id, 
      updateCategoryMock
    );

    expect(spy.mock.calls[0][0]).toEqual({
      ...categoryEntityMock,
      ...updateCategoryMock,
    });
  });
});
