import { ReturnAddressDTO } from '../../address/dtos/returnAddress.dto';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';
import { OrderEntity } from '../entities/order.entity';
import { ReturnPaymentDTO } from '../../payment/dtos/returnPayment.dto';
import { ReturnOrderProductDTO } from '../../order-product/dtos/returnOrderProduct.dto';

export class ReturnOrderDto {
  id: number;
  date: string;
  userId?: number;
  addressId?: number;
  paymentId?: number;
  user?: ReturnUserDto;
  address?: ReturnAddressDTO;
  payment?: ReturnPaymentDTO;
  ordersProduct?: ReturnOrderProductDTO[];

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date.toString();
    this.user = order.user ? new ReturnUserDto(order.user) : undefined;
    this.userId = order.userId;
    this.addressId = order.addressId;
    this.paymentId = order.paymentId;
    this.address = order.address 
        ? new ReturnAddressDTO(order.address) 
        : undefined;
      this.payment = order.payment 
        ? new ReturnPaymentDTO(order.payment) 
        : undefined;
      this.ordersProduct = order.ordersProduct 
        ? order.ordersProduct.map(
            (orderProduct) => new ReturnOrderProductDTO(orderProduct),
          )
        : undefined
  }
}