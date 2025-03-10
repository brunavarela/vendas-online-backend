import { Controller, Get } from '@nestjs/common';
import { ReturnCategory } from './dtos/returnCategory.dto';
import { CategoryService } from './category.service';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from 'src/user/enum/user-type.enum';

@Roles(UserType.Admin, UserType.User)
@Controller('category')
export class CategoryController {

  constructor (
    private readonly categoryService: CategoryService
  ){}

  @Get()
  async findAllCategories(): Promise<ReturnCategory[]> {
    return (await this.categoryService.findAllCategories()
  ).map((category) => new ReturnCategory(category));
  }
}
