import { Controller } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from 'src/user/enum/user-type.enum';

@Roles(UserType.Admin)
@Controller('cart')
export class CartController {}
