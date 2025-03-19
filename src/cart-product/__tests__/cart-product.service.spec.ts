import { Test, TestingModule } from '@nestjs/testing';
import { CartProductService } from '../cart-product.service';
import { ProductService } from '../../product/product.service';
import { Repository } from 'typeorm';
import { CartProductEntity } from '../entities/cartProduct.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productEntityMock } from '../../product/__mocks__/product.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { cartEntityMock } from '../../cart/__mocks__/cart.mock';
import { insertCartEntityMock } from '../../cart/__mocks__/insertCart.mock';
import { cartProductEntityMock } from '../__mocks__/cartProduct.mock';
import { NotFoundException } from '@nestjs/common';
import { updateCartEntityMock } from '../../cart/__mocks__/updateCart.mock copy';

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
            findOne: jest.fn().mockResolvedValue(cartProductEntityMock),
            save: jest.fn().mockResolvedValue(cartProductEntityMock),
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

    expect(
      service.deleteProductCart(productEntityMock.id, cartEntityMock.id),
    ).rejects.toThrow()
  });

  // Create product cart test
  it('should return cartProduct after create', async () => {
    const productCart = await service.createProductInCart (
      insertCartEntityMock, 
      cartEntityMock.id
    );

    expect(productCart).toEqual(cartProductEntityMock);
  });

  it('should return error in exception create', async () => {
    jest.spyOn(cartProductRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.createProductInCart(insertCartEntityMock, cartEntityMock.id),
    ).rejects.toThrow()
  });

  // Verify product in cart test
  it('should return cartProduct if exist', async () => {
    const productCart = await service.verifyProductInCart (
      productEntityMock.id, 
      cartEntityMock.id
    );

    expect(productCart).toEqual(cartProductEntityMock);
  });

  it('should return error if not found', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.verifyProductInCart(productEntityMock.id, cartEntityMock.id),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return error in exception verifyProductInCart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockRejectedValue(new Error());

    expect(
      service.verifyProductInCart(productEntityMock.id, cartEntityMock.id),
    ).rejects.toThrow(Error);
  });

  // insert product in cart test
  it('should return error in exception insertProductInCart', async () => {
    jest.spyOn(productService, 'findProductById').mockRejectedValue(new NotFoundException());

    expect(
      service.insertProductInCart(insertCartEntityMock, cartEntityMock),
    ).rejects.toThrow(NotFoundException);
  });

  it('Should return a cart product if no product exists', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    const cartProduct = await service.insertProductInCart(
      insertCartEntityMock, 
      cartEntityMock
    );

    expect(cartProduct).toEqual(cartProductEntityMock);
    expect(spy.mock.calls[0][0].amount).toEqual(insertCartEntityMock.amount);
  });

  it('should add a product if it already exists', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.insertProductInCart(
      insertCartEntityMock, 
      cartEntityMock
    );

    expect(cartProduct).toEqual(cartProductEntityMock);
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartProductEntityMock,
      amount: cartProductEntityMock.amount + insertCartEntityMock.amount,
    });
  });

  // update product in cart test
  it('should return error in exception updateProductInCart', async () => {
    jest.spyOn(productService, 'findProductById').mockRejectedValue(new NotFoundException());

    expect(
      service.updateProductInCart(updateCartEntityMock, cartEntityMock),
    ).rejects.toThrow(NotFoundException);
  });

  it('Should return a cart product if no product exists (updateProductInCart)', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.updateProductInCart(
      updateCartEntityMock, 
      cartEntityMock
    )).rejects.toThrow(NotFoundException);
  });

  it('should add a product if it already exists (updateProductInCart)', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.updateProductInCart(
      updateCartEntityMock, 
      cartEntityMock
    );

    expect(cartProduct).toEqual(cartProductEntityMock);
    expect(spy.mock.calls[0][0].amount).toEqual(updateCartEntityMock.amount);
  });
});
