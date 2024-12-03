import { IsDefined, IsNumber, IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

class EnvironmentVariables {
  @IsDefined()
  @IsNumber()
  POSTGRES_PORT: number;

  @IsDefined()
  @IsString()
  POSTGRES_HOST: string;

  @IsDefined()
  @IsString()
  POSTGRES_USER: string;

  @IsDefined()
  @IsString()
  POSTGRES_DB: string;

  @IsDefined()
  @IsString()
  POSTGRES_PASSWORD: string;
}

export function validate(config: Record<string, any>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
