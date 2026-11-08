import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const dresses = pgTable('dresses', {
  id: serial().primaryKey(),
  name: text().notNull(),
  category: text().notNull(),
  note: text().notNull().default(''),
  imageKey: text('image_key').notNull(),
  liked: boolean().notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
