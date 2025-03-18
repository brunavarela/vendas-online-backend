import { ReturnCartDTO } from "src/cart/dtos/returnCart.dto";
import { ReturnProduct } from "src/product/dtos/returnProduct.dto";
import { CartProductEntity } from "../entities/cartProduct.entity";

export class ReturnCartProductDTO {
  id: number;
  cartId: number;
  productId: number;
  amount: number;
  product?: ReturnProduct;
  cart?: ReturnCartDTO;

  constructor(cartProduct: CartProductEntity) {
    this.id = cartProduct.id;
    this.cartId = cartProduct.cartId;
    this.productId = cartProduct.amount;
    this.amount = cartProduct.amount;

    //se cartProduct.product existir vai receber o return, senao, undefined
    this.product = cartProduct.product ? new ReturnProduct(cartProduct.product) : undefined;
    this.cart = cartProduct.cart ? new ReturnCartDTO(cartProduct.cart) : undefined;
  }
}