import { Pool } from 'pg';

const connectConfig = {
  user: process.env.DATABASE_USER ?? 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  database: process.env.DATABASE_NAME ?? 'hoopsfusion',
  password: process.env.DATABASE_PASSWORD ?? 'password',
  port: parseInt(process.env.DATABASE_PORT ?? '5432'),
};

if (process.env.NODE_ENV === 'production') {
  (connectConfig as any).ssl = {
    rejectUnauthorized: false
  };
}

export const pool = new Pool(connectConfig);

console.log(process.env);