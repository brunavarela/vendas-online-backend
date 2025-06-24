import { Pagination } from "../../dtos/pagination.dto";
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

export const productPaginationMock: Pagination<ProductEntity[]> = {
  data: [productEntityMock],
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 10,
    totalPages: 1,
  }
}