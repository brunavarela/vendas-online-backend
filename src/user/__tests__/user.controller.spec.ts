import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { createUserMock } from '../__mocks__/createUser.mock';
import { userEntityMock } from '../__mocks__/user.mock';
import { updatePasswordMock } from '../__mocks__/updatePassword.mock';
import { ReturnUserDto } from '../dtos/returnUser.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(userEntityMock),
            updatePasswordUser: jest.fn().mockResolvedValue(userEntityMock),
            getAllUser: jest.fn().mockResolvedValue([userEntityMock]),
            getUserByIdUsingRelations: jest.fn().mockResolvedValue(userEntityMock),
          },
        }
      ],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return user in createUser', async () => {
    const user = await controller.createUser(createUserMock);

    expect(user).toEqual(userEntityMock);
  });

  it('should return all users', async () => {
    const users = await controller.getAllUser();

    expect(users).toEqual([
      {
        id: userEntityMock.id,
        name: userEntityMock.name,
        email: userEntityMock.email,
        phone: userEntityMock.phone,
        cpf: userEntityMock.cpf
      },
    ]);
  });

  it('should return ReturnUser in getUserById', async () => {
    const user = await controller.getUserById(userEntityMock.id);

    expect(user).toEqual(
      {
        id: userEntityMock.id,
        name: userEntityMock.name,
        email: userEntityMock.email,
        phone: userEntityMock.phone,
        cpf: userEntityMock.cpf
      },
    );
  });

  it('should return user entity in updatePasswordUser', async () => {
    const user = await controller.updatePasswordUser(
      updatePasswordMock, 
      userEntityMock.id
    );

    expect(user).toEqual(userEntityMock);
  });

  it('should return ReturnUserEntity in getInfoUser', async () => {
    const user = await controller.getInfoUser(
      userEntityMock.id
    );

    expect(user).toEqual(new ReturnUserDto(userEntityMock));
  });
});
