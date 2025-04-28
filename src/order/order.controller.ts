import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderDTO } from './dtos/createOrder.dto';
import { OrderService } from './order.service';
import { UserId } from '../decorators/user-id.decorator';
import { OrderEntity } from './entities/order.entity';

@Controller('order')
export class OrderController {

  constructor(
    private readonly orderService: OrderService
  ) {}
  
  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(
    @Body() createOrderDTO: CreateOrderDTO,
    @UserId() UserId: number,
  ): Promise<OrderEntity> {
    return  this.orderService.createOrder(createOrderDTO, UserId)
  }

  @Get()
  async findOrdersByUserId(@UserId() userId: number) {
    return this.orderService.findOrdersByUserId(userId)
  }
}
