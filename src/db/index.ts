// src/db/index.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
const pass = process.env.DB_PASSWORD || '';

// Buat koneksi pool ke database
const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  password: pass,
  database: process.env.DB_DATABASE,
});

export const db = drizzle(poolConnection);