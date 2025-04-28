import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReturnCategory } from './dtos/returnCategory.dto';
import { CategoryService } from './category.service';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/user-type.enum';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategory } from './dtos/createCategory.dto';
import { DeleteResult } from 'typeorm';


@Controller('category')
export class CategoryController {

  constructor (
    private readonly categoryService: CategoryService
  ){}

  @Roles(UserType.User, UserType.Admin)
  @Get()
  async findAllCategories(): Promise<ReturnCategory[]> {
    return this.categoryService.findAllCategories();
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createCategory(
    @Body() createCategory: CreateCategory
  ): Promise<CategoryEntity> {
    return this.categoryService.createCategory(createCategory);
  }

  @Roles(UserType.Admin)
  @Delete('/:categoryId')
  async deleteCategory(
    @Param('categoryId') categoryId: number
  ): Promise<DeleteResult> {
    return this.categoryService.deleteCategory(categoryId);
  }
}
