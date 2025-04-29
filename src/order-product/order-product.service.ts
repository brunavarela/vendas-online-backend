import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProductEntity } from './entities/order-product.entity';
import { Repository } from 'typeorm';
import { ReturnGroupOrderDTO } from './dtos/returnGroupOrder.dto';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProductEntity)
    private readonly orderProductRepository: Repository<OrderProductEntity>
  ) {}

  async createOrderProduct(
    productId: number, 
    orderId: number, 
    price: number, 
    amount: number): Promise<OrderProductEntity> {
      return this.orderProductRepository.save({
        amount,
        orderId,
        price,
        productId
      })
  }

  async findAmountProductsByOrderId(
    orderId: number[],
  ): Promise<ReturnGroupOrderDTO[]> {
    return this.orderProductRepository 
      .createQueryBuilder('order_product')
      .select('order_product.order_id, COUNT(*) as total')
      .where('order_product.order_id IN (:...ids)', { ids: orderId })
      .groupBy('order_product.order_id')
      .getRawMany();
  }
}
