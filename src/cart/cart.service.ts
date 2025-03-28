import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertCartDTO } from './dtos/insertCart.dto';
import { CartProductService } from '../cart-product/cart-product.service';
import { UpdateCartDTO } from './dtos/updateCart.dto';

const LINE_AFFECTED = 1;
@Injectable()
export class CartService {

  constructor (
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly cartProductService: CartProductService,
  ) {}

  async clearCart(userId: number): Promise<DeleteResult> {
    const cart = await this.findCartByUserId(userId);
    await this.cartRepository.save({
      ...cart,
      active: false,
    });

    return {
      raw:[],
      affected: LINE_AFFECTED,
    }
  }

  async findCartByUserId(
    userId: number, 
    isRelations?: boolean
  ): Promise<CartEntity> {

    const relations = isRelations ? {
      cartProduct: {
        product: true
      }
    } : undefined;

    const cart = await this.cartRepository.findOne({
      where: {
        userId,
        active: true,
      },
      relations,
    });

    if (!cart) {
      throw new NotFoundException(`Cart active not found`);
    }

    return cart;
  }

  async createCart(userId: number): Promise<CartEntity> {
    return this.cartRepository.save({
      active: true,
      userId,
    })
  }

  async insertProductInCart(
    insertCartDTO: InsertCartDTO, 
    userId: number,
  ): Promise<CartEntity> {
    
    // verificando se o carrinho está ativo
    const cart = await this.findCartByUserId(userId)
    .catch(async() => {
      return this.createCart(userId)
    });

    await this.cartProductService.insertProductInCart(insertCartDTO, cart);

    return cart;
  }

  async deleteProductCart(
    productId: number, 
    userId: number
  ): Promise<DeleteResult> {
    
    const cart = await this.findCartByUserId(userId)

    return this.cartProductService.deleteProductCart(productId, cart.id);
  }

  async updateProductInCart(
    updateCartDTO: UpdateCartDTO, 
    userId: number,
  ): Promise<CartEntity> {
    const cart = await this.findCartByUserId(userId)
    .catch(async() => {
      return this.createCart(userId)
    });

    await this.cartProductService.updateProductInCart(updateCartDTO, cart);

    return cart;
  }
}
