import { productEntityMock } from "../../product/__mocks__/product.mock";
import { InsertCartDTO } from "../dtos/insertCart.dto";

export const insertCartEntityMock: InsertCartDTO = {
  amount: 434,
  productId: productEntityMock.id
}