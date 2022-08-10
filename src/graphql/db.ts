import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hoopsfusion',
  password: 'password',
  port: 5432,
});