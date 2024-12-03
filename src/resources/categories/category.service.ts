import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './inputs/category.input';
import { Product } from '../../database/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  public async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  public async create(
    createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    const newCategory = this.categoryRepository.create(createCategoryInput);

    return this.categoryRepository.save(newCategory);
  }

  public async update(
    id: number,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    const category = await this.findOne(id);
    this.categoryRepository.merge(category, updateCategoryInput);

    return this.categoryRepository.save(category);
  }

  public async remove(id: number): Promise<boolean> {
    return this.categoryRepository
      .delete({ id })
      .then((data) => data.affected >= 1);
  }

  public async getProductsForCategory(categoryId: number): Promise<Product[]> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['products'],
    });
    return category.products;
  }
}
