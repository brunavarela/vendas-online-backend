import { PaymentCreditCardEntity } from '../entities/payment-credit-cart.entity';
import { paymentMock } from './payment.mock'

export const paymentCreditCardMock: PaymentCreditCardEntity = {
  ...paymentMock,
  amountPayments: 54
}