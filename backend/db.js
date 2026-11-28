
import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    // REQUIRED for TiDB Cloud Serverless
    ssl: {
      minVersion: 'TLSv1.2',
    },

    connectTimeout: 20000,
  },
  pool: {
    min: 0,
    max: 3,
  },
  acquireConnectionTimeout: 20000,
});

export default db;
