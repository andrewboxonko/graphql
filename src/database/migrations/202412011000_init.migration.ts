import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1733058927000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT category_id_primary PRIMARY KEY (id)
            );

            CREATE TABLE "products" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" text,
                "price" numeric(10,2) NOT NULL DEFAULT '0.00',
                "image_url" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "category_id" integer NOT NULL,
                CONSTRAINT product_id_primary PRIMARY KEY (id),
                CONSTRAINT product_category_id FOREIGN KEY (category_id) REFERENCES categories(id)
            );
        `);

    await queryRunner.query(`
            INSERT INTO "categories" ("name") VALUES ('Electronics'), ('Books'), ('Clothing');
            INSERT INTO "products" ("name", "description", "price", "category_id") VALUES 
                ('Smartphone', 'High-end smartphone.', 799.99, (SELECT id FROM "categories" WHERE "name" = 'Electronics')),
                ('Designing Data-Intensive Applications', 'Book on building scalable and maintainable applications.', 45.99, (SELECT id FROM "categories" WHERE "name" = 'Books')),
                ('T-shirt', 'Cotton t-shirt.', 19.99, (SELECT id FROM "categories" WHERE "name" = 'Clothing'));
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "products";
            DROP TABLE "categories";
        `);
  }
}
