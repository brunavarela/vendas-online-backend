import { Body, Controller, Get, Param, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderDTO } from './dtos/createOrder.dto';
import { OrderService } from './order.service';
import { UserId } from '../decorators/user-id.decorator';
import { OrderEntity } from './entities/order.entity';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/user-type.enum';
import { ReturnOrderDto } from './dtos/returnOrder.dto';
import { Response } from 'express';

@Roles(UserType.User, UserType.Admin, UserType.Root)
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
    return  this.orderService.createOrder(createOrderDTO, UserId);
  }

  @Get()
  async findOrdersByUserId(
    @UserId() userId: number,
    @Res({ passthrough: true }) res?: Response,
  ): Promise<OrderEntity[]> {
    const orders = await this.orderService
      .findOrdersByUserId(userId)
      .catch(() => undefined);

    if (orders) {
      return orders;
    }

    res.status(204).send();

    return;
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/all')
  async findAllOrders(): Promise<ReturnOrderDto[]> {
    return (await this.orderService.findAllOrders()).map(
      (order) => new ReturnOrderDto(order),
    )
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/:orderId')
  async findOrderById(
    @Param('orderId') orderId: number,
  ): Promise<ReturnOrderDto> {
    return new ReturnOrderDto(
      (await this.orderService.findOrdersByUserId(undefined, orderId))[0],
    );
  }
}
