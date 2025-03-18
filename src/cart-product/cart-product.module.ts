import { Module } from '@nestjs/common';
import { CartProductService } from './cart-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProductEntity } from './entities/cartProduct.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartProductEntity])],
  providers: [CartProductService],
  exports: [CartProductService],
})
export class CartProductModule {}
