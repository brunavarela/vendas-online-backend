import { ReturnOrderDto } from '../../order/dtos/returnOrder.dto';
import { ReturnProduct } from '../../product/dtos/returnProduct.dto';
import { OrderProductEntity } from '../entities/order-product.entity';

export class ReturnOrderProductDTO {
  id: number;
  orderId: number;
  productId: number;
  amount: number;
  price: number;
  order?: ReturnOrderDto;
  product?: ReturnProduct;

  constructor (orderProduct: OrderProductEntity) {
    this.id = orderProduct.id;
    this.orderId = orderProduct.orderId;
    this.productId = orderProduct.productId;
    this.amount = orderProduct.amount;
    this.price = orderProduct.price;
    this.order = orderProduct.order
      ? new ReturnOrderDto(orderProduct.order)
      : undefined;
    this.product = orderProduct.product
      ? new ReturnProduct(orderProduct.product)
      : undefined;
  }
}