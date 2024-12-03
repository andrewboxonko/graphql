import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import {
  DatabaseConfig,
  DB_CONFIG_TOKEN,
} from '../config/namespaces/db.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfig>(DB_CONFIG_TOKEN);

        return {
          type: 'postgres',
          host: dbConfig.pgHost,
          port: dbConfig.pgPort,
          username: dbConfig.pgUser,
          password: dbConfig.pgPassword,
          database: dbConfig.pgDB,
          entities: [Product, Category],
          migrations: ['dist/database/migrations/*{.ts,.js}'],
          migrationsRun: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
