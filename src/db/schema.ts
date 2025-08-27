// src/db/schema.ts
import { unique } from "drizzle-orm/gel-core";
import { mysqlTable, int, varchar, timestamp, mysqlDatabase } from "drizzle-orm/mysql-core";
import { userAgent } from "next/server";
import { platform } from "os";


export const users = mysqlTable("users", {
  id: int("id").primaryKey(),
  fullName: varchar("full_name", { length: 256 }),
  username: varchar("username", { length: 256 }),
  userAliasName: varchar("userAliasName", { length: 256 }),
  email: varchar("email", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),

});
export const data = mysqlTable(
  "data",{
    id:int("id").primaryKey(),
    userId:int("user_id").notNull().references(() => users.id),
    userEmail:varchar("email",{length:256}).notNull().unique().references(()=>users.email),
    lastLogin:timestamp("lastLogin"),
    ip:varchar("ip", {length: 45}),
    IpLocation:varchar("IpLocation",{length:256}),
    userAgent:varchar("userAgent",{length:256}),
    platform:varchar("platform",{length:256}),
  }
);