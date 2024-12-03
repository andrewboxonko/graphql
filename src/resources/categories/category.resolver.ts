import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from '../../database/entities/category.entity';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './inputs/category.input';
import { Product } from '../../database/entities/product.entity';
import { GraphQLBoolean } from 'graphql/type';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category])
  public async getCategories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Query(() => Category)
  public getCategoryById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => Category)
  public createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryInput);
  }

  @Mutation(() => Category)
  public updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Mutation(() => GraphQLBoolean)
  public removeCategory(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.categoryService.remove(id);
  }

  @ResolveField(() => [Product])
  async products(@Parent() category: Category): Promise<Product[]> {
    return this.categoryService.getProductsForCategory(category.id);
  }
}
