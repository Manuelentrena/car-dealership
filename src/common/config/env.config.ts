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
    api: {
      port: parseInt(process.env.NEST_PORT, 10) || 3000,
    },
  };
};
