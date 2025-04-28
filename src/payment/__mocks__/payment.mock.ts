import { PaymentType } from "../../payment-status/enums/payment-type.enum";
import { PaymentEntity } from "../entities/payment.entity";

export const paymentMock: PaymentEntity = {
  createdAt: new Date(),
  discount: 432,
  finalPrice: 64365.4,
  id: 52568,
  price: 68764.0,
  statusId: PaymentType.Done,
  updatedAt: new Date(),
  type: '',
}