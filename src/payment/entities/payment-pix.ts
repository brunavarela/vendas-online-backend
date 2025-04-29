
import { ChildEntity, Column } from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { CreateOrderDTO } from '../../order/dtos/createOrder.dto';

@ChildEntity()
export class PaymentPixEntity extends PaymentEntity {
  @Column({ name: 'code', nullable: false })
  code: string;

  @Column({ name: 'date_payment', nullable: false })
  datePayment: Date;

  // quando tem herança, estamos herdando as infos do pai
  // entao, precisa dar um super (construtor do pai),
  // pois precisa construir os dados do pai e depois do filho
  constructor(
    statusId: number, 
    price: number, 
    discount: number, 
    finalPrice: number,
    createOrderDTO: CreateOrderDTO
  ) {
      super(statusId, price, discount, finalPrice);
      this.code = createOrderDTO.codePix || '';
      this.datePayment = new Date(createOrderDTO.datePayment || '')
    }
}