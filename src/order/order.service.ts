import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './dtos/createOrder.dto';

@Injectable()
export class OrderService {

  constructor (
    @InjectRepository(OrderEntity)
    private readonly orderEntity: Repository<OrderEntity>
  ) {}

  async createOrder(createOrderDTO: CreateOrderDTO, cartId: number) {
    return null;
  }
}
