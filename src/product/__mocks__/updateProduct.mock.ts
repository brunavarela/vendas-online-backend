import { categoryEntityMock } from "../../category/__mocks__/category.mock";
import { UpdateProductDTO } from "../dtos/updateProduct.dto";

export const updateProductMock: UpdateProductDTO = {
  categoryId: categoryEntityMock.id,
  image: 'grgregtg',
  name: 'name mock update product',
  price: 29.9,
};