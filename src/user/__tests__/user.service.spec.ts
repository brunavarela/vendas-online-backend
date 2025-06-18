import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userEntityMock } from '../__mocks__/user.mock';
import { createUserMock } from '../__mocks__/createUser.mock';
import { updatePasswordInvalidMock, updatePasswordMock } from '../__mocks__/updatePassword.mock';
import { UserType } from '../enum/user-type.enum';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            save: jest.fn().mockResolvedValue(userEntityMock),
          },  
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  // Repository Test
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined()
  });

  // findUserByEmail test
  it('should return user in findUserByEmail', async () => {
    const user = await service.findUserByEmail(userEntityMock.email);

    expect(user).toEqual(userEntityMock);
  });

  it('should return error in findUserByEmail', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined)

    await expect(
      service.findUserByEmail(userEntityMock.email),
    ).rejects.toThrow(`Email: ${userEntityMock.email} Not Found`)
  });

  it('should return error in findUserByEmail (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error())

    await expect(
      service.findUserByEmail(userEntityMock.email),
    ).rejects.toThrow()
  });

  // findUserById test
  it('should return user in findUserById', async () => {
    const user = await service.findUserById(userEntityMock.id);

    expect(user).toEqual(userEntityMock);
  });

  it('should return error in findUserById', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined)

    await expect(
      service.findUserById(userEntityMock.id),
    ).rejects.toThrow(`UserId: ${userEntityMock.id} Not Found`)
  });

  it('should return error in findUserById (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error())

    await expect(
      service.findUserById(userEntityMock.id),
    ).rejects.toThrow()
  });

  // getUserByIdUsingRelations test
  it('should return user in getUserByIdUsingRelations', async () => {
    const user = await service.getUserByIdUsingRelations(userEntityMock.id);

    expect(user).toEqual(userEntityMock);
  });

  // create user test
  it('should return error if user exist', async () => {
    expect(service.createUser(createUserMock)).rejects.toThrow('Email registered in system')
  });

  it('should return user and user admin if user not exist', async () => {
    const spy = jest.spyOn(userRepository, 'save');
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    await service.createUser(createUserMock, UserType.Admin);

    expect(spy.mock.calls[0][0].typeUser).toEqual(UserType.Admin);
  });

  // Update password test
  it('should return user in update password', async () => {
    const user = await service.updatePasswordUser(
      updatePasswordMock, 
      userEntityMock.id
    );

    expect(user).toEqual(userEntityMock);
  });

  it('should return invalid password in invalid password', async () => {
    expect(service.updatePasswordUser(
      updatePasswordInvalidMock, 
      userEntityMock.id)
    ).rejects.toThrow();
  });

  it('should return error in user not exist', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.updatePasswordUser(
      updatePasswordMock, 
      userEntityMock.id)
    ).rejects.toThrow();
  });
});
