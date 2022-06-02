module.exports = {
  name: 'default',
  type: 'postgres',
  host: 'localhost',
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['./src/modules/**/entities/*{.js,.ts}'],
  migrations: ['./src/shared/database/migrations/*{.js,.ts}'],
  seeds: ['./src/shared/database/seeds/*{.js,.ts}'],
  factories: ['./src/shared/database/factories/*{.ts,.js}'],
  cli: {
    migrationsDir: './src/shared/database/migrations',
  },
};
