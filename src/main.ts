import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    graphqlUploadExpress({
      maxFiles: 1,
      maxFileSize: 1000000,
      overrideSendResponse: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
