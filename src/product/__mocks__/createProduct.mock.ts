import { categoryEntityMock } from "../../category/__mocks__/category.mock";
import { CreateProductDTO } from "../dtos/createProduct.dto";

export const createProduct: CreateProductDTO = {
  categoryId: categoryEntityMock.id,
  image: 'fferfeegr',
  name: 'name mock product',
  price: 25.9,
};