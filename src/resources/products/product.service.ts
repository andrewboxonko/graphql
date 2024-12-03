import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { CreateProductInput, UpdateProductInput } from './inputs/product.input';
import { Category } from '../../database/entities/category.entity';
import { FileUpload } from 'graphql-upload-ts';
import * as path from 'path';
import * as fs from 'fs';
import { CategoryService } from '../categories/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject() private categoryService: CategoryService,
  ) {}

  async create(
    createProductInput: CreateProductInput & { image_url: string },
  ): Promise<Product> {
    const category = await this.categoryService.findOne(
      createProductInput.category_id,
    );

    const product = this.productRepository.create({
      ...createProductInput,
      category,
    });

    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }

  public async update(
    id: number,
    updateProductInput: UpdateProductInput & { image_url?: string },
  ): Promise<Product> {
    const product = await this.findOne(id);
    const category = await this.categoryService.findOne(
      updateProductInput.category_id,
    );

    this.productRepository.merge(product, { ...updateProductInput, category });

    return this.productRepository.save(product);
  }

  public async remove(id: number): Promise<boolean> {
    return this.productRepository
      .delete({ id })
      .then((data) => data.affected >= 1);
  }

  async getCategoryForProduct(productId: number): Promise<Category> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['category'],
    });
    return product.category;
  }

  async uploadImage(file: FileUpload): Promise<string> {
    const { createReadStream, filename } = file;
    const uploadPath = path.join(__dirname, '../../../src/uploads', filename);
    const readStream = createReadStream();

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(uploadPath);
      readStream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    return `/uploads/${filename}`;
  }
}
