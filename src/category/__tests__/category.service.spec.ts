import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryEntityMock } from '../__mocks__/category.mock';
import { createCategoryMock } from '../__mocks__/createCategory.mock';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, {
        provide: getRepositoryToken(CategoryEntity),
        useValue: {
          findOne: jest.fn().mockResolvedValue(categoryEntityMock),
          find: jest.fn().mockResolvedValue([categoryEntityMock]),
          save: jest.fn().mockResolvedValue(categoryEntityMock),
        }
      }],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity));
  });

  // Repository Test
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  // List categories Test
  it('should return list category', async () => {
    const categories = await service.findAllCategories();

    expect(categories).toEqual([categoryEntityMock])
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

  it('should return category in find by name', async () => {
    const category = await service.findCategoryByName(categoryEntityMock.name);

    expect(category).toEqual(categoryEntityMock);
  });
  
  it('should return error if category find by name empty', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockReturnValue(undefined);

    expect(service.findCategoryByName(categoryEntityMock.name)).rejects.toThrow();
  });

  it('should return category in find by id', async () => {
    const category = await service.findCategoryById(categoryEntityMock.id);

    expect(category).toEqual(categoryEntityMock)
  });

  it('should return error in not found categoryId', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);
    
    expect(service.findCategoryById(categoryEntityMock.id)).rejects.toThrow();
  });
});
