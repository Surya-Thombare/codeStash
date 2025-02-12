import { pgTable, text, timestamp, varchar, integer, index, AnyPgColumn } from 'drizzle-orm/pg-core';
import { createInsertSchema } from "drizzle-zod";

import { z } from "zod";

export const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('deleted_at')
}

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: varchar({ length: 255 }).notNull(),
  ...timestamps
});

export const snippets = pgTable('snippets', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  title: text('title').notNull(),
  code: text('code').notNull(),
  language: varchar('language', { length: 50 }).notNull(),
  tags: text('tags').array().default([]),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id),
  ...timestamps
});

export const comments = pgTable('comments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  content: text('content').notNull(),
  snippetId: integer('snippet_id')
    .notNull()
    .references(() => snippets.id),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id),
  parentId: integer('parent_id')
    .references((): AnyPgColumn => comments.id),
  ...timestamps
}, (table) => ({
  snippetIdIdx: index('comment_snippet_idx').on(table.snippetId),
  userIdIdx: index('comment_user_idx').on(table.userId),
  parentIdIdx: index('comment_parent_idx').on(table.parentId)
}));

// Types
export type Snippet = typeof snippets.$inferSelect;
export type NewSnippet = typeof snippets.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

// Schemas
export const insertSnippetSchema = createInsertSchema(snippets).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export type InsertSnippet = z.infer<typeof insertSnippetSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
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