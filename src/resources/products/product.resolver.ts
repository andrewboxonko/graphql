import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { Product } from '../../database/entities/product.entity';
import { ProductService } from './product.service';
import { CreateProductInput, UpdateProductInput } from './inputs/product.input';
import { Category } from '../../database/entities/category.entity';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
import { GraphQLBoolean } from 'graphql/type';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @Args({ name: 'image', type: () => GraphQLUpload }) image: FileUpload,
  ): Promise<Product> {
    const imageUrl = await this.productService.uploadImage(image);

    return this.productService.create({
      ...createProductInput,
      image_url: imageUrl,
    });
  }

  @Query(() => [Product])
  async getProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Query(() => Product)
  async getProductById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product)
  public async updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @Args({ name: 'image', type: () => GraphQLUpload, nullable: true })
    image: FileUpload,
  ): Promise<Product> {
    const imageUrl = image
      ? await this.productService.uploadImage(image)
      : null;

    return this.productService.update(updateProductInput.id, {
      ...updateProductInput,
      image_url: imageUrl,
    });
  }

  @Mutation(() => GraphQLBoolean)
  public removeProduct(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.productService.remove(id);
  }

  @ResolveField(() => Category)
  async category(@Parent() product: Product): Promise<Category> {
    return this.productService.getCategoryForProduct(product.id);
  }
}
