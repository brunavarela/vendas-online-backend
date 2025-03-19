import { productEntityMock } from "../../product/__mocks__/product.mock";
import { UpdateCartDTO } from "../dtos/updateCart.dto";

export const updateCartEntityMock: UpdateCartDTO = {
  amount: 34345,
  productId: productEntityMock.id
}