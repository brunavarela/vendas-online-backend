import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCategory } from './dtos/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor (
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAllCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find();

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Category empty');
    }

    return categories;
  }

  async findCategoryById(categoryId: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
      }
    });

    if (!category) {
      throw new NotFoundException(`Category id: ${categoryId} not found`)
    }

    return category;
  }

  async findCategoryByName(name: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });

    if(!category) {
      throw new NotFoundException(`Category name ${name} not found`);
    }

    return category;
  }

  async createCategory(
    createCategory: CreateCategory,
  ): Promise<CategoryEntity> {
    const category = await this.findCategoryByName(createCategory.name).catch(
      () =>undefined,
    )

    if(category) {
      throw new BadRequestException(`Category name ${createCategory.name} already exist`);
    }

    return this.categoryRepository.save(createCategory);
  }

  async deleteCategory(categoryId: number): Promise<DeleteResult> {
    await this.findCategoryById(categoryId);

    return this.categoryRepository.delete({ id: categoryId });
  }
}
