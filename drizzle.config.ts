// drizzle.config.ts
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" }); // Muat variabel dari .env.local
const pass = process.env.DB_PASSWORD || '';

export default {
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    password: pass,
    database: process.env.DB_DATABASE,
  },
  verbose: true
} satisfies Config;