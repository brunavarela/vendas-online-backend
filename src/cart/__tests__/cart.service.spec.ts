import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartProductService } from '../../cart-product/cart-product.service';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { cartEntityMock } from '../__mocks__/cart.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { NotFoundException } from '@nestjs/common';
import { insertCartEntityMock } from '../__mocks__/insertCart.mock';
import { productEntityMock } from '../../product/__mocks__/product.mock';
import { updateCartEntityMock } from '../__mocks__/updateCart.mock copy';

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

    const resultDelete = await service.clearCart(userEntityMock.id);

    expect(resultDelete).toEqual(returnDeleteMock);
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartEntityMock,
      active: false,
    });
  });

  it('should return in findOne undefined', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.clearCart(userEntityMock.id)
    ).rejects.toThrow(NotFoundException);
  });

  //find cart by id test
  it('should return cart in success (send relations)', async () => {
    const spy = jest.spyOn(cartRepository, 'findOne');
    const cart = await service.findCartByUserId(userEntityMock.id);

    expect(cart).toEqual(cartEntityMock);
    expect(spy.mock.calls[0][0].relations).toEqual(undefined);
  });

  it('should return cart in success (not send relations)', async () => {
    const spy = jest.spyOn(cartRepository, 'findOne');
    const cart = await service.findCartByUserId(userEntityMock.id, true);

    expect(cart).toEqual(cartEntityMock);
    expect(spy.mock.calls[0][0].relations).toEqual({
      cartProduct: {
        product: true,
      }
    });
  });

  it('should return notFoundException in not found cart', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findCartByUserId(userEntityMock.id)
    ).rejects.toThrow(NotFoundException);
  });

  it('should return send info in save (createCart)', async () => {
    const spy = jest.spyOn(cartRepository, 'save');

    const cart = await service.createCart(userEntityMock.id);

    expect(cart).toEqual(cartEntityMock);
    expect(spy.mock.calls[0][0]).toEqual({
      active: true,
      userId: userEntityMock.id,
    })
  });

  it('should return cart in cart not found (insertProductInCart)', async () => {
    jest.spyOn(cartRepository, 'findOne').mockRejectedValue(undefined);
    const spy = jest.spyOn(cartRepository, 'save');
    const spyCartProductService = jest.spyOn(
      cartProductService, 'insertProductInCart',
    );

    const cart = await service.insertProductInCart(insertCartEntityMock, userEntityMock.id);

    expect(cart).toEqual(cartEntityMock);
    expect(spy.mock.calls.length).toEqual(1);
    expect(spyCartProductService.mock.calls.length).toEqual(1);
  });

  it('should return cart in cart found (insertProductInCart)', async () => {
    const spy = jest.spyOn(cartRepository, 'save');
    const spyCartProductService = jest.spyOn(
      cartProductService, 'insertProductInCart',
    );

    const cart = await service.insertProductInCart(insertCartEntityMock, userEntityMock.id);

    expect(cart).toEqual(cartEntityMock);
    expect(spy.mock.calls.length).toEqual(0);
    expect(spyCartProductService.mock.calls.length).toEqual(1);
  });

  it('should return DeleteResult in deleteProductCart', async () => {
    const spy = jest.spyOn(cartProductService, 'deleteProductCart');

    const deleteResult = await service.deleteProductCart(
      productEntityMock.id, 
      userEntityMock.id
    );
    
    expect(deleteResult).toEqual(returnDeleteMock);
    expect(spy.mock.calls.length).toEqual(1);
  });

  it('should return NotFoundException in cart not exist', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    const spy = jest.spyOn(cartProductService, 'deleteProductCart');
    
    expect(
      service.deleteProductCart(
        productEntityMock.id,
        userEntityMock.id)
    ).rejects.toThrow(NotFoundException);
    expect(spy.mock.calls.length).toEqual(0);
  });

  // Update product in cart test
  it('should return cart in updateProductInCart', async () => {
    const spyCartProductService = jest.spyOn(
      cartProductService, 
      'updateProductInCart',
    );

    const spySave = jest.spyOn(
      cartRepository, 
      'save',
    );

    const cart = await service.updateProductInCart(
      updateCartEntityMock,
      userEntityMock.id
    );
    
    expect(cart).toEqual(cartEntityMock);
    expect(spyCartProductService.mock.calls.length).toEqual(1);
    expect(spySave.mock.calls.length).toEqual(0);
  });

  it('should return cart in createCart', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    const spySave = jest.spyOn(
      cartRepository, 
      'save',
    );

    const cart = await service.updateProductInCart(
      updateCartEntityMock,
      userEntityMock.id
    );
    
    expect(cart).toEqual(cartEntityMock);
    expect(spySave.mock.calls.length).toEqual(1);
  });
});
