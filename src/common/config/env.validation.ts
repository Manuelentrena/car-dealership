import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Base de datos
  MONGO_ROOT_USERNAME: Joi.string().required(),
  MONGO_ROOT_PASSWORD: Joi.string().required(),
  MONGO_PORT: Joi.number().default(27017),
  MONGO_HOST: Joi.string().default('localhost'),
  MONGO_DB: Joi.string().default('car_leadership'),
  MONGO_EXPRESS_PORT: Joi.number().default(8081),

  // API
  PORT: Joi.number().default(3000),
});
