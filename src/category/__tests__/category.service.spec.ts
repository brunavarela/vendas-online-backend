import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryEntityMock } from '../__mocks__/category.mock';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, {
        provide: getRepositoryToken(CategoryEntity),
        useValue: {
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

  // Error list category empty
  it('should return error in list category empty', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);
    
    expect(service.findAllCategories()).rejects.toThrow()
  });

  // Error list category exception
  it('should return error in list category exception', async () => {
    jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error())

    expect(service.findAllCategories()).rejects.toThrow()
  });
});
