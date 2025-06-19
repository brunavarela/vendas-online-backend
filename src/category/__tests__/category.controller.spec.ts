import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { categoryEntityMock } from '../__mocks__/category.mock';
import { createCategoryMock } from '../__mocks__/createCategory.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAllCategories: jest.fn().mockResolvedValue([categoryEntityMock]),
            createCategory: jest.fn().mockResolvedValue(categoryEntityMock),
            deleteCategory: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        }
      ],
      controllers: [CategoryController],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  it('should return category entity in findAllCategories', async () => {
    const category = await controller.findAllCategories();

    expect(category).toEqual([categoryEntityMock]);
  });

  it('should return category entity in createCategory', async () => {
    const category = await controller.createCategory(createCategoryMock);

    expect(category).toEqual(categoryEntityMock);
  });

  it('should return deleteResult in delete category', async () => {
    const category = await controller.deleteCategory(categoryEntityMock.id);

    expect(category).toEqual(returnDeleteMock);
  }
);
  it('should send category id to delete category', async () => {
    const spy = jest.spyOn(categoryService, 'deleteCategory');
    const category = await controller.deleteCategory(categoryEntityMock.id);

    expect(category).toEqual(returnDeleteMock);
    expect(spy.mock.calls[0][0]).toEqual(categoryEntityMock.id);
  });

});
