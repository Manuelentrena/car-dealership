import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import logger from './common/config/winston.config';
import { AllExceptionsFilter } from './common/errors/all-exceptions';

async function main() {
  const app = await NestFactory.create(AppModule, { logger });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('api.port', 3000);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  await app.listen(port);
}
main();
