import { productEntityMock } from "../../product/__mocks__/product.mock";
import { cartEntityMock } from "../../cart/__mocks__/cart.mock";
import { CartProductEntity } from "../entities/cartProduct.entity";

export const cartProductEntityMock: CartProductEntity = {
  amount: 3435,
  cartId: cartEntityMock.id,
  createdAt: new Date(),
  id: 343,
  productId: productEntityMock.id,
  updatedAt: new Date()
}