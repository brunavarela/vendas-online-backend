import { productEntityMock } from '../../product/__mocks__/product.mock';
import { orderMock } from '../../order/__mocks__/order.mock';
import { OrderProductEntity } from '../entities/order-product.entity';

export const orderProductMock: OrderProductEntity = {
  amount: 543,
  createdAt: new Date(),
  id: 4898,
  orderId: orderMock.id,
  price: 543.4,
  productId: productEntityMock.id,
  updatedAt: new Date()
}