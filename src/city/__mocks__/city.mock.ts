import { stateEntityMock } from "../../state/__mocks__/state.mock";
import { CityEntity } from "../entities/city.entity";

export const cityEntityMock: CityEntity = {
  createdAt: new Date(),
  id: 34243,
  name: 'cityNameMock',
  stateId: stateEntityMock.id,
  updatedAt: new Date()
};