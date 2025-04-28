import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from 'src/order/dtos/createOrder.dto';
import { PaymentCreditCardEntity } from './entities/payment-credit-cart.entity';
import { PaymentType } from '../payment-status/enums/payment-type.enum';
import { PaymentPixEntity } from './entities/payment-pix';
import { ProductEntity } from 'src/product/entities/product.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { CartProductEntity } from 'src/cart-product/entities/cartProduct.entity';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>
  ){}

  generateFinalPrice(cart: CartEntity, products: ProductEntity[]) {
    if(!cart.cartProduct || cart.cartProduct.length === 0) {
      return 0;
    }

    return cart.cartProduct
    .map((cartProduct: CartProductEntity) => {
      const product = products.find(
        (product) => product.id === cartProduct.productId
      );
      if(product) {
        return cartProduct.amount * product.price;
      }

      return 0;
    })
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  async createPayment(
    createOrderDTO: CreateOrderDTO, 
    products: ProductEntity[], 
    cart: CartEntity,
  ): Promise<PaymentEntity> {
    const finalPrice = this.generateFinalPrice(cart, products)

    if (createOrderDTO.amountPayments) {
      const paymentCreditCart = new PaymentCreditCardEntity(
        PaymentType.Done, 
        finalPrice, 
        0, 
        finalPrice, 
        createOrderDTO,
      );

      return this.paymentRepository.save(paymentCreditCart)
      
    } 
    else if (createOrderDTO.codePix && createOrderDTO.datePayment) {
      const paymentPix = new PaymentPixEntity(
        PaymentType.Done, 
        finalPrice, 
        0, 
        finalPrice, 
        createOrderDTO,
      );

      return this.paymentRepository.save(paymentPix)
    }

    throw new BadRequestException (
      'Amount Payments, code pix or date payment not found'
    )
  }
}
