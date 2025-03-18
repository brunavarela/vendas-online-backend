import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductEntity } from './entities/cartProduct.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertCartDTO } from 'src/cart/dtos/insertCart.dto';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { ProductService } from 'src/product/product.service';
import { UpdateCartDTO } from 'src/cart/dtos/updateCart.dto';

@Injectable()
export class CartProductService {

  constructor (
    @InjectRepository(CartProductEntity)
    private readonly cartProductReposiory: Repository<CartProductEntity>,
    private readonly productService: ProductService
  ){}

  async verifyProductInCart(
    productId: number, 
    cartId: number,
  ): Promise<CartProductEntity> {
    const cartProduct = await this.cartProductReposiory.findOne({
      where: {
        productId,
        cartId,
      }
    });

    if(!cartProduct) {
      throw new NotFoundException('Product not found in cart')
    }

    return cartProduct;
  }

  async createProductInCart(
    insertCartDTO: InsertCartDTO, 
    cartId: number,
  ): Promise<CartProductEntity> {

    return this.cartProductReposiory.save({
      amount: insertCartDTO.amount,
      productId: insertCartDTO.productId,
      cartId,
    })

  }

  async insertProductInCart(
    insertCartDTO: InsertCartDTO, 
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    await this.productService.findProductById(insertCartDTO.productId);

    const cartProduct = await this.verifyProductInCart(
      insertCartDTO.productId, 
      cart.id,
    ).catch(() => undefined);
    
    // se nao existir produto no carrinho, vou criar
    if(!cartProduct) {
      return this.createProductInCart(insertCartDTO, cart.id);
    };

    // se existir, vou adicionar
    return this.cartProductReposiory.save({
      ...cartProduct,
      amount: cartProduct.amount + insertCartDTO.amount,
    });
  }

  async updateProductInCart(
    updateCartDTO: UpdateCartDTO, 
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    await this.productService.findProductById(updateCartDTO.productId);

    const cartProduct = await this.verifyProductInCart(
      updateCartDTO.productId, 
      cart.id,
    );

    return this.cartProductReposiory.save({
      ...cartProduct,
      amount: updateCartDTO.amount,
    });
  }

  async deleteProductCart(
    productId: number, 
    cartId:number
  ): Promise<DeleteResult> {
    return this.cartProductReposiory.delete({ productId, cartId })
  }
}
