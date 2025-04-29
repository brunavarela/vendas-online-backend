import { ReturnAddressDTO } from '../../address/dtos/returnAddress.dto';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';
import { OrderEntity } from '../entities/order.entity';
import { ReturnPaymentDTO } from '../../payment/dtos/returnPayment.dto';
import { OrderProductEntity } from '../../order-product/entities/order-product.entity';

export class ReturnOrderDto {
  id: number;
  date: string;
  user?: ReturnUserDto;
  address?: ReturnAddressDTO;
  payment?: ReturnPaymentDTO;
  ordersProduct?: OrderProductEntity[];

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date.toString();
    this.user = order.user ? new ReturnUserDto(order.user) : undefined;
    this.address = order.address 
      ? new ReturnAddressDTO(order.address) 
      : undefined;
      this.payment = order.payment 
      ? new ReturnPaymentDTO(order.payment) 
      : undefined;
      this.ordersProduct = order.ordersProduct;
  }
}