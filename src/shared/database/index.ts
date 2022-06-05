/* eslint-disable no-console */
import { createConnections } from 'typeorm';

const mode = 'src';

createConnections([
  {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [`./${mode}/modules/**/entities/*{.js,.ts}`],
    migrations: [`./${mode}/shared/database/migrations/*{.js,.ts}`],
  },
])
  .then(() => console.log('📖 Successfully connected with database'))
  .catch(error => console.log(`😧 error connected with database: ${error}`));
