import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import logger from './common/config/winston.config';
import { AllExceptionsFilter } from './common/errors/all-exceptions';

async function main() {
  // Create a new NestJS application instance using the AppModule and custom logger
  const app = await NestFactory.create(AppModule, { logger });

  // Retrieve the configuration service from the app container
  const configService = app.get(ConfigService);
  // Get the port number from configuration, fallback to 3000 if undefined
  const port = configService.get<number>('api.port', 3000);

  // Apply the global exception filter to catch unhandled exceptions across the app
  app.useGlobalFilters(new AllExceptionsFilter());

  // Apply a global validation pipe to sanitize and validate incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not in the DTO
      forbidNonWhitelisted: true, // Throw error if unknown properties are sent
      transform: true, // Automatically transform payloads to match DTO types
    }),
  );

  // Swagger configuration for generating API documentation
  const config = new DocumentBuilder()
    .setTitle('Car Dealership') // Title of the API
    .setDescription('Car Dealership API') // Description
    .setVersion('1.0') // Version number
    .addTag('cars') // Tag to group related endpoints
    .build();

  // Create the OpenAPI document using the Swagger configuration
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  // Setup the Swagger UI under the /api path
  SwaggerModule.setup('api', app, documentFactory);

  // Set a global prefix for all routes (e.g., /api/...)
  app.setGlobalPrefix('api');

  // Serve static files (like uploaded images) from the 'uploads' folder
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Start listening on the specified port
  await app.listen(port);
}
main();
