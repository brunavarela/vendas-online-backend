import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCategory } from './dtos/createCategory.dto';
import { ProductService } from '../product/product.service';
import { ReturnCategory } from './dtos/returnCategory.dto';
import { CountProduct } from '../product/dtos/countProduct.dto';
import { UpdateCategory } from './dtos/updateCategory';

@Injectable()
export class CategoryService {
  constructor (
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  findAmountCategoryInProducs(
    category: CategoryEntity, 
    countList: CountProduct[],
  ): number {
    const count = countList.find(
      (itemCount) => itemCount.category_id === category.id
    );

    if(count) {
      return count.total;
    };

    return 0;
  }

  async findAllCategories(): Promise<ReturnCategory[]> {
    const categories = await this.categoryRepository.find();

    const count = await this.productService.countProductsByCategoryId();

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Categories empty');
    }

    return categories.map(
      (category) => 
        new ReturnCategory(
          category, 
          this.findAmountCategoryInProducs(category, count),
        ),
    );
  }

  async findCategoryById(categoryId: number, isRelations?: boolean): Promise<CategoryEntity> {
    const relations = isRelations ? { products: true } : undefined;
   
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
      },
      relations
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
    const category = await this.findCategoryById(categoryId, true);

    const products = Array.isArray(category.products) ? category.products : category.products ? [category.products] : [];
    if (products.length > 0) {
      throw new BadRequestException('Category with relations');  
    }

    return this.categoryRepository.delete({ id: categoryId });
  }

  async editCategory(
    categoryId: number, updateCategory: UpdateCategory,
  ): Promise<CategoryEntity> {
    const category = await this.findCategoryById(categoryId);

    return this.categoryRepository.save({
      ...category, 
      ...updateCategory,
    });
  }

}
