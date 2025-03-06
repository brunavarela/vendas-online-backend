import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { jwtMock } from '../__mocks__/jwt.mock';
import { loginUserMock } from '../__mocks__/loginUser.mock';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';


describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn().mockResolvedValue(userEntityMock),
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => jwtMock,
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  // Repository Test
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  // Email and password valid Test
  it('should return user if password and email valid', async () => {
    const user = await service.login(loginUserMock);

    expect(user).toEqual({
      accessToken: jwtMock,
      user: new ReturnUserDto(userEntityMock),
    })
  });

  // Email and password invalid Test
  it('should return user if password invalid and email invalid', async () => {
    expect(
      service.login({...loginUserMock, password:'45465'}),
    ).rejects.toThrow();
  });

  // Email not exist test
  it('should return user if email not exist', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(undefined);

    expect(
      service.login(loginUserMock),
    ).rejects.toThrow();
  });

  // Email not exist test
  it('should return error in userService', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockRejectedValue(new Error());

    expect(
      service.login(loginUserMock),
    ).rejects.toThrow();
  });
});