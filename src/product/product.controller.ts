import { Controller, Get } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from 'src/user/enum/user-type.enum';
import { ReturnProtuct } from './dtos/returnProduct.dto';
import { ProductService } from './product.service';

@Roles(UserType.Admin, UserType.User)
@Controller('product')
export class ProductController {
  
  constructor(
    private readonly productService: ProductService
  ){}

  @Get()
  async findAll(): Promise<ReturnProtuct[]> {
    return (await this.productService.findAll()).map(
      (product) => new ReturnProtuct(product),
    );
  }
}
