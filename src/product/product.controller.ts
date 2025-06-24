import { Body, Controller, Delete, Get, Param, Post, Put, Query, Search, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/user-type.enum';
import { ReturnProduct } from './dtos/returnProduct.dto';
import { ProductService } from './product.service';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDTO } from './dtos/createProduct.dto';
import { DeleteResult } from 'typeorm';
import { UpdateProductDTO } from './dtos/updateProduct.dto';
import { Pagination } from 'src/dtos/pagination.dto';

@Roles(UserType.Admin, UserType.Root, UserType.User)
@Controller('product')
export class ProductController {
  
  constructor(
    private readonly productService: ProductService
  ){}

  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @Get()
  async findAll(): Promise<ReturnProduct[]> {
    return (await this.productService.findAll([], true)).map(
      (product) => new ReturnProduct(product),
    );
  }

  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @Get('/page')
  async findAllPage(
    @Query('search') search?: string, 
    @Query('size') size?: number,
    @Query('page') page?: number,
  ): Promise<Pagination<ReturnProduct[]>> {
    return this.productService.findAllPage(search, size, page);
  }
  
  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @Get('/:productId')
  async findProductById(@Param('productId') productId): Promise<ReturnProduct> {
    return new ReturnProduct (
      await this.productService.findProductById(productId, true)
    );
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct (
    @Body() createProduct: CreateProductDTO,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }

  @Roles(UserType.Admin, UserType.Root)
  @Delete('/:productId')
  async deleteProduct (
    @Param('productId') productId: number,
  ): Promise<DeleteResult> {
    return this.productService.deleteProduct(productId);
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Put('/:productId')
  async updateProduct (
    @Body() updateProduct: UpdateProductDTO,
    @Param('productId') productId: number,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(updateProduct, productId);
  }  
}
