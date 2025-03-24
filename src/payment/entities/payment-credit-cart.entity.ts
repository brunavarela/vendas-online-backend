
import { ChildEntity, Column } from "typeorm";
import { PaymentEntity } from "./payment.entity";

@ChildEntity()
export class PaymentCreditCartEntity extends PaymentEntity {
  @Column({ name: 'amount_payments', nullable: false })
  amountPayments: number;
}