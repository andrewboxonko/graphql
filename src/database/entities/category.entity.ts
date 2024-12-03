import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ObjectType, Field } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql/dist/scalars';

@ObjectType()
@Entity({ name: 'categories' })
export class Category {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
