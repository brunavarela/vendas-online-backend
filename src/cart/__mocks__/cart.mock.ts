import { userEntityMock } from "../../user/__mocks__/user.mock";
import { CartEntity } from "../entities/cart.entity";

export const cartEntityMock: CartEntity = {
  active: true,
  createdAt: new Date(),
  id: 43345,
  updatedAt: new Date(),
  userId: userEntityMock.id
}