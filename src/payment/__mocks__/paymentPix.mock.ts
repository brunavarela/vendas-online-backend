import { createOrderPixMock } from '../../order/__mocks__/createOrder.mock';
import { PaymentPixEntity } from '../entities/payment-pix';
import { paymentMock } from './payment.mock'

export const paymentPixMock: PaymentPixEntity = {
  ...paymentMock,
  code: 'iudusfs',
  datePayment: new Date('2020-01-01')
}