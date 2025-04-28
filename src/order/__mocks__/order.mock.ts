import { addressEntityMock } from '../../address/__mocks__/address.mock';
import { OrderEntity } from '../entities/order.entity';
import { paymentMock } from '../../payment/__mocks__/payment.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';

export const orderMock: OrderEntity = {
  addressId: addressEntityMock.id,
  createdAt: new Date(),
  date: new Date(),
  id: 48575,
  paymentId: paymentMock.id,
  updatedAt: new Date(),
  userId: userEntityMock.id, 
}