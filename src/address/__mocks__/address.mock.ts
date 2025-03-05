import { cityEntityMock } from "../../city/__mocks__/city.mock";
import { AddressEntity } from "../entities/address.entity";
import { userEntityMock } from "../../user/__mocks__/user.mock";

export const addressEntityMock: AddressEntity = {
  id: 34334,
  complement: 'fdfdgdrg',
  numberAddress: 3424,
  cep: '435345',
  cityId: cityEntityMock.id,
  userId: userEntityMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
}
