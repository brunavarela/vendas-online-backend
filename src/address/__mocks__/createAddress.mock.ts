import { cityEntityMock } from "../../city/__mocks__/city.mock";
import { CreateAddressDto } from "../dtos/createAddress.dto";
import { addressEntityMock } from "./address.mock";


export const createAddressMock: CreateAddressDto = {
  complement: addressEntityMock.complement,
  numberAddress: 3424,
  cep: '435345',
  cityId: cityEntityMock.id,
}
