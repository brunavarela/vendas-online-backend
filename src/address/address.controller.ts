import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateAddressDTO } from './dtos/createAddress.dto';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/user-type.enum';
import { UserId } from '../decorators/user-id.decorator';
import { ReturnAddressDTO } from './dtos/returnAddress.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('address')
export class AddressController {

  constructor(
    private readonly addressService: AddressService
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createAddress(
    @Body() createAddressDto: CreateAddressDTO,
    @UserId() userId: number,
  ): Promise<AddressEntity> {
    return this.addressService.createAddress(createAddressDto, userId);
  }

  @Get()
  async findAddressByUserId(
    @UserId() userId: number,
  ): Promise<ReturnAddressDTO[]> {
    return (await this.addressService.findAddressByUserId(userId)).map(
      (address) => new ReturnAddressDTO(address)
    );
  }
}


