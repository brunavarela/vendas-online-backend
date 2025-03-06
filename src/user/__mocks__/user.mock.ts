import { UserEntity } from '../entities/user.entity';
import { UserType } from '../enum/user-type.enum';

export const userEntityMock: UserEntity = {
  cpf: '1234344343',
  createdAt: new Date(),
  email: 'emailmock@email.com',
  id: 43543,
  name: 'nameMock',
  password: '$2b$10$X2TiKmXauqqmJ55DVjNMH.81tuNNxB.74a7RqwOC2xZrFsseXC39q',
  phone: '43445464564',
  typeUser: UserType.User,
  updatedAt: new Date(),
};