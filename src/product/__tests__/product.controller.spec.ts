import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { productEntityMock, productPaginationMock } from '../__mocks__/product.mock';
import { ProductService } from '../product.service';
import { createProductMock } from '../__mocks__/createProduct.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { updateProductMock } from '../__mocks__/updateProduct.mock';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([productEntityMock]),
            createProduct: jest.fn().mockResolvedValue(productEntityMock),
            updateProduct: jest.fn().mockResolvedValue(productEntityMock),
            deleteProduct: jest.fn().mockResolvedValue(returnDeleteMock),
            findAllPage: jest.fn().mockResolvedValue(productPaginationMock),
          },
        }
      ],
      controllers: [ProductController],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('should return returnProduct in findAll', async () => {
    const product = await controller.findAll();

    expect(product).toEqual([
      {
        id: productEntityMock.id,
        name: productEntityMock.name,
        price: productEntityMock.price,
        image: productEntityMock.image
      }
    ]);
  });

  it('should return returnProduct in createProduct', async () => {
    const product = await controller.createProduct(createProductMock);

    expect(product).toEqual(productEntityMock);
  });

  it('should return returnDelete in deleteProduct', async () => {
    const product = await controller.deleteProduct(productEntityMock.id);

    expect(product).toEqual(returnDeleteMock);
  });

  it('should return productEntity in updateProduct', async () => {
    const product = await controller.updateProduct(updateProductMock, productEntityMock.id);

    expect(product).toEqual(productEntityMock);
  });

  it('should return productEntity in findAllPage', async () => {
    const product = await controller.findAllPage();

    expect(product).toEqual(productPaginationMock)
  });

  it('should return productEntity in findAllPage', async () => {
    const mockSearch = 'mockSearch';
    const mockSize = 232;
    const mockPage = 4343;
    const spy = jest.spyOn(productService, 'findAllPage')

    await controller.findAllPage(mockSearch, mockSize, mockPage);

    expect(spy.mock.calls[0][0]).toEqual(mockSearch)
    expect(spy.mock.calls[0][1]).toEqual(mockSize)
    expect(spy.mock.calls[0][2]).toEqual(mockPage)
  })
});
