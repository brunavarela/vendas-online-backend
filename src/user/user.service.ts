import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  private users: User [] = []

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return ({
      ...createUserDto, 
      id: 1,
    })
  }
}
