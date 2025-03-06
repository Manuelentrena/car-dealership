export const EnvConfiguration = () => {
  const username = process.env.MONGO_ROOT_USERNAME || 'admin';
  const password = process.env.MONGO_ROOT_PASSWORD || 'secret';
  const host = process.env.MONGO_HOST || 'localhost';
  const port = parseInt(process.env.MONGO_PORT, 10) || 27017;
  const database = process.env.MONGO_DB || 'car_leadership';

  return {
    mongo: {
      username,
      password,
      port,
      host,
      database,
      expressPort: parseInt(process.env.MONGO_EXPRESS_PORT, 10) || 8081,
      uri: `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`,
    },
    postgres: {
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.BD_USER || 'postgres',
      password: process.env.DB_PASS || 'secret',
      database: process.env.DB_NAME || 'car_leadership',
      autoLoadEntities: true,
      synchronize: false,
    },
    api: {
      port: parseInt(process.env.PORT, 10) || 3000,
    },
  };
};
