import { cityEntityMock } from "../../city/__mocks__/city.mock";
import { CreateAddressDTO } from "../dtos/createAddress.dto";
import { addressEntityMock } from "./address.mock";


export const createAddressMock: CreateAddressDTO = {
  complement: addressEntityMock.complement,
  numberAddress: 3424,
  cep: '435345',
  cityId: cityEntityMock.id,
}
