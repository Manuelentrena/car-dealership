import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Base de datos
  MONGO_ROOT_USERNAME: Joi.string().required(),
  MONGO_ROOT_PASSWORD: Joi.string().required(),
  MONGO_PORT: Joi.number().default(27017),
  MONGO_HOST: Joi.string().default('localhost'),
  MONGO_DB: Joi.string().default('car_leadership'),
  MONGO_EXPRESS_PORT: Joi.number().default(8081),

  // Base de datos Postgres
  DB_HOST: Joi.string().required().default('localhost'),
  DB_PORT: Joi.number().required().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // PG Admin
  PGADMIN_EMAIL: Joi.string().optional(),
  PGADMIN_PASSWORD: Joi.string().optional(),
  PGADMIN_PORT: Joi.number().default(5050),

  // API
  PORT: Joi.number().default(3000),

  // Cloudflare
  CLOUDFLARE_ACCOUNT_ID: Joi.string().required(),
  CLOUDFLARE_API_TOKEN: Joi.string().required(),
});
