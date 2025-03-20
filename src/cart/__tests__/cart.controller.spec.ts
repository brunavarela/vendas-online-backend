import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { CartController } from '../cart.controller';
import { cartEntityMock } from '../__mocks__/cart.mock';
import { insertCartEntityMock } from '../__mocks__/insertCart.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { updateCartEntityMock } from '../__mocks__/updateCart.mock copy';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CartService,
          useValue: {
            insertProductInCart: jest.fn().mockResolvedValue(cartEntityMock),
            findCartByUserId: jest.fn().mockResolvedValue(cartEntityMock),
            clearCart: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProductInCart: jest.fn().mockResolvedValue(cartEntityMock),
          },
        }
      ],
      controllers: [CartController],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(cartService).toBeDefined();
  });

  it('should cart entity in insertProductInCart', async () => {
    const cart = await controller.createCart(
      insertCartEntityMock, 
      userEntityMock.id
    );

    expect(cart).toEqual({
      id: cartEntityMock.id
    });
  });

  it('should cart entity in findCartByUserId', async () => {
    const cart = await controller.findCartByUserId(userEntityMock.id);

    expect(cart).toEqual({
      id: cartEntityMock.id
    });
  });

  it('should return delete result in clearCart', async () => {
    const cart = await controller.clearCart(userEntityMock.id);

    expect(cart).toEqual(returnDeleteMock);
  });

  it('should return delete result in updateProductInCart', async () => {
    const cart = await controller.updateProductInCart(
      updateCartEntityMock, 
      userEntityMock.id
    );

    expect(cart).toEqual({
      id: cartEntityMock.id
    });  
  });
});
