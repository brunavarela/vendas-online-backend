import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReturnCategory } from './dtos/returnCategory.dto';
import { CategoryService } from './category.service';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from 'src/user/enum/user-type.enum';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategory } from './dtos/createCategory.dto';


@Controller('category')
export class CategoryController {

  constructor (
    private readonly categoryService: CategoryService
  ){}

  @Roles(UserType.User)
  @Get()
  async findAllCategories(): Promise<ReturnCategory[]> {
    return (await this.categoryService.findAllCategories()).map(
      (category) => new ReturnCategory(category)
    );
  }

  @Roles(UserType.Admin, UserType.User)
  @UsePipes(ValidationPipe)
  @Post()
  async createCategory(
    @Body() createCategory: CreateCategory
  ): Promise<CategoryEntity> {
    return this.categoryService.createCategory(createCategory);
  }
}
