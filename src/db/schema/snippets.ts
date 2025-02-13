import { text, varchar, integer, pgTable } from 'drizzle-orm/pg-core';

import { timestamps } from './common';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './auth-schema';


export const snippets = pgTable('snippets', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  title: text('title').notNull(),
  code: text('code').notNull(),
  language: varchar('language', { length: 50 }).notNull(),
  tags: text('tags').array().default([]),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id),
  ...timestamps
});

// Schemas
export const insertSnippetSchema = createInsertSchema(snippets).omit({
  id: true,
  createdAt: true,
});

// Types
export type Snippet = typeof snippets.$inferSelect;
export type NewSnippet = typeof snippets.$inferInsert;

export const languages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
  "shell",
  "markdown",
] as const;

export const languageSchema = z.enum(languages);
