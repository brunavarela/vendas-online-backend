import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult, ILike, In, Like, Repository } from 'typeorm';
import { CreateProductDTO } from './dtos/createProduct.dto';
import { CategoryService } from '../category/category.service';
import { UpdateProductDTO } from './dtos/updateProduct.dto';
import { CountProduct } from './dtos/countProduct.dto';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}

  async findAllPage(search?: string,): Promise<ProductEntity[]>{
    let findOptions = {};

    if (search) {
      findOptions = {
        where: {
          name: ILike(`%${search}%`)
        },
      };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException('not found products');
    };

    return products;
  }
  
  async findAll(
    productId?: number[], 
    isFindRelations?: boolean,
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        },
      };
    }

    if (isFindRelations) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true
        },
      };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException('not found products');
    }

    return products;
  }

  async createProduct(createProduct: CreateProductDTO): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(createProduct.categoryId);

    return this.productRepository.save({
      ...createProduct,
    })
  }
  
  async findProductById(productId: number, isRelations?: boolean): Promise<ProductEntity> {
    const relations = isRelations ? { category: true } : undefined;

    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
      relations,
    });

    if(!product) {
      throw new NotFoundException(`Product id ${productId} not found`);
    }

    return product;
  }

  async deleteProduct(productId: number): Promise<DeleteResult> {
    await this.findProductById(productId);
    
    return this.productRepository.delete({ id: productId });    
  }

  async updateProduct(updateProduct: UpdateProductDTO, productId: number): Promise<ProductEntity> {
    const product = await this.findProductById(productId);

    return this.productRepository.save({
      ...product,
      ...updateProduct
    })
  }

  async countProductsByCategoryId(): Promise<CountProduct[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .select('product.category_id, COUNT(*) as total')
      .groupBy('product.category_id')
      .getRawMany();
  }
}
