import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { OrderEntity } from '../entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<OrderEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, {
        provide: getRepositoryToken(OrderEntity),
        useValue: {
          find: ''
        }
      }],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<OrderEntity>>(getRepositoryToken(OrderEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderRepository).toBeDefined();
  });
});
