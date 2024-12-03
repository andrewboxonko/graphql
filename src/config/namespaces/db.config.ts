import { registerAs } from '@nestjs/config';

export const DB_CONFIG_TOKEN = 'db';

export class DatabaseConfig {
  readonly pgPort: number = parseInt(process.env.POSTGRES_PORT, 10);

  readonly pgHost: string = process.env.POSTGRES_HOST;

  readonly pgUser: string = process.env.POSTGRES_USER;

  readonly pgDB: string = process.env.POSTGRES_DB;

  readonly pgPassword: string = process.env.POSTGRES_PASSWORD;
}

export const dbConfig = registerAs(DB_CONFIG_TOKEN, () => new DatabaseConfig());
