import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { OrderEntity } from '../entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentService } from '../../payment/payment.service';
import { CartService } from '../../cart/cart.service';
import { OrderProductService } from '../../order-product/order-product.service';
import { ProductService } from '../../product/product.service';
import { orderMock } from '../__mocks__/order.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { NotFoundException } from '@nestjs/common';
import { orderProductMock } from '../../order-product/__mocks__/orderProduct.mock';
import { cartEntityMock } from '../../cart/__mocks__/cart.mock';
import { productEntityMock } from '../../product/__mocks__/product.mock';
import { cartProductEntityMock } from '../../cart-product/__mocks__/cartProduct.mock';
import { createOrderPixMock } from '../__mocks__/createOrder.mock';
import { paymentMock } from '../../payment/__mocks__/payment.mock';

jest.useFakeTimers().setSystemTime(new Date('2020-01-01'))

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<OrderEntity>;
  let paymentService: PaymentService;
  let cartService: CartService;
  let orderProductService: OrderProductService;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService, 
        {
          provide: PaymentService,
          useValue: {
            createPayment: jest.fn().mockResolvedValue(paymentMock),
          }
        },
        {
          provide: CartService,
          useValue: {
            findCartByUserId: jest.fn().mockResolvedValue({
              ...cartEntityMock,
              cartProduct: [cartProductEntityMock],
            }),
            clearCart: jest.fn(),
          }
        },
        {
          provide: OrderProductService,
          useValue: {
            createOrderProduct: jest.fn().mockResolvedValue(orderProductMock),
          }
        },
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([productEntityMock]),
          }
        },
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([orderMock]),
            save: jest.fn().mockResolvedValue(orderMock),
          }
        }
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    paymentService = module.get<PaymentService>(PaymentService);
    cartService = module.get<CartService>(CartService);
    orderProductService = module.get<OrderProductService>(OrderProductService);
    productService = module.get<ProductService>(ProductService);
    orderRepository = module.get<Repository<OrderEntity>>(getRepositoryToken(OrderEntity));
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(paymentService).toBeDefined();
    expect(cartService).toBeDefined();
    expect(orderProductService).toBeDefined();
    expect(productService).toBeDefined();
    expect(orderRepository).toBeDefined();
  });

  it('should return orders in findOrderByUserId', async () => {
    const spy = jest.spyOn(orderRepository, 'find');
    const orders = await service.findOrdersByUserId(userEntityMock.id)

    expect(orders).toEqual([orderMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        userId: userEntityMock.id,
        id: undefined,
      },
      relations: {
        address: {
          city: {
            state: true,
          }
        },
        ordersProduct: {
          product: true,
        },
        payment: {
          paymentStatus: true,
        },
        user: false,
      }
    })
  });

  it('should return NotFoundException in find return empty', async () => {
    jest.spyOn(orderRepository, 'find').mockResolvedValue([]);

    expect(service.findOrdersByUserId(userEntityMock.id)).rejects.toThrow(NotFoundException);
  });

  it('should calls createOrderProduct amount cartProduct in cart', async () => {
    const spyOrderProduct = jest.spyOn(
      orderProductService,
      'createOrderProduct'
    );

    const createOrderProductUsingCart = 
      await service.createOrderProductUsingCart(
        {
          ...cartEntityMock, 
          cartProduct: [cartProductEntityMock, cartProductEntityMock]
        },
        orderMock.id, 
        [productEntityMock]
      );

    expect(createOrderProductUsingCart).toEqual([
      orderProductMock, 
      orderProductMock
    ]);
    expect(spyOrderProduct.mock.calls.length).toEqual(2);
  });

  it('should return order in saveOrder', async () => {
    const spy = jest.spyOn(orderRepository, 'save');

    const order = await service.saveOrder(
      createOrderPixMock, 
      userEntityMock.id,
      paymentMock
    );

    expect(order).toEqual(orderMock);
    expect(spy.mock.calls[0][0]).toEqual({
      addressId: createOrderPixMock.addressId,
      date: new Date(),
      paymentId: paymentMock.id,
      userId: userEntityMock.id
    });
  });

  it('should return exception in error save', async () => {
    jest.spyOn(orderRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.saveOrder(createOrderPixMock, userEntityMock.id, paymentMock
    )).rejects.toThrow();
  });

  it('should return order in create order success', async () => {
    const spyCartService = jest.spyOn(cartService, 'findCartByUserId');
    const spyProductService = jest.spyOn(productService, 'findAll');
    const spyOrderProductService = jest.spyOn(orderProductService, 'createOrderProduct');
    const spyPaymentService = jest.spyOn(paymentService, 'createPayment');
    const spySave = jest.spyOn(orderRepository, 'save');
    const spyCartServiceClear = jest.spyOn(cartService, 'clearCart');

    const order = await service.createOrder(
      createOrderPixMock, 
      userEntityMock.id
    );

    expect(order).toEqual(orderMock);
    expect(spyCartService.mock.calls.length).toEqual(1);
    expect(spyProductService.mock.calls.length).toEqual(1);
    expect(spyOrderProductService.mock.calls.length).toEqual(1);
    expect(spyPaymentService.mock.calls.length).toEqual(1);
    expect(spySave.mock.calls.length).toEqual(1);
    expect(spyCartServiceClear.mock.calls.length).toEqual(1);
  });

  it('should return orders', async () => {
    const spy = jest.spyOn(orderRepository, 'find');
    const orders = await service.findAllOrders();

    expect(orders).toEqual([orderMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      relations: {
        user: true
      },
    });
  });

  it('should return error in not found', async () => {
    jest.spyOn(orderRepository, 'find').mockResolvedValue([]);

    expect(service.findAllOrders()).rejects.toThrow(new NotFoundException('Orders not found'));
  });
});
