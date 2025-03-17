import { categoryEntityMock } from "../../category/__mocks__/category.mock";
import { ProductEntity } from "../entities/product.entity";

export const productEntityMock: ProductEntity = {
  categoryId: categoryEntityMock.id,
  createdAt: new Date(),
  id: 4324,
  image: 'http//image.com',
  name: 'name product mock',
  price: 34.4,
  updatedAt: new Date(),
}