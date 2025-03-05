import { UserEntity } from '../entities/user.entity';
import { UserType } from '../enum/user-type.enum';

export const userEntityMock: UserEntity = {
  cpf: '1234344343',
  createdAt: new Date(),
  email: 'emailmock@email.com',
  id: 43543,
  name: 'nameMock',
  password: 'largePassword',
  phone: '43445464564',
  typeUser: UserType.User,
  updatedAt: new Date(),
};