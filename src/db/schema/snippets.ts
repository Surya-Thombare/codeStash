import { text, varchar, integer, pgTable, jsonb, boolean, AnyPgColumn } from 'drizzle-orm/pg-core';
import { timestamps } from './common';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { relations } from 'drizzle-orm';
import { users } from './auth-schema';

// Main snippets table
export const snippets = pgTable('snippets', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  title: text('title').notNull(),
  description: text('description'),
  code: text('code').notNull(),
  language: varchar('language', { length: 50 }).notNull(),
  tags: text('tags').array().default([]),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id),
  likes_count: integer('likes_count').default(0).notNull(),
  comments_count: integer('comments_count').default(0).notNull(),
  bookmarks_count: integer('bookmarks_count').default(0).notNull(),
  shares_count: integer('shares_count').default(0).notNull(),
  is_private: boolean('is_private').default(false).notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
  ...timestamps
});

// Snippet likes table
export const snippetLikes = pgTable('snippet_likes', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  snippet_id: integer('snippet_id')
    .notNull()
    .references(() => snippets.id, { onDelete: 'cascade' }),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ...timestamps
});

// Comments table
export const snippetComments = pgTable('snippet_comments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  content: text('content').notNull(),
  snippet_id: integer('snippet_id')
    .notNull()
    .references(() => snippets.id, { onDelete: 'cascade' }),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parent_id: integer('parent_id').references((): AnyPgColumn => snippetComments.id),
  metadata: jsonb('metadata').default({}).notNull(),
  ...timestamps
});

// Relations
export const snippetsRelations = relations(snippets, ({ many, one }) => ({
  likes: many(snippetLikes),
  comments: many(snippetComments),
  user: one(users, {
    fields: [snippets.user_id],
    references: [users.id],
  }),
}));

export const snippetLikesRelations = relations(snippetLikes, ({ one }) => ({
  snippet: one(snippets, {
    fields: [snippetLikes.snippet_id],
    references: [snippets.id],
  }),
  user: one(users, {
    fields: [snippetLikes.user_id],
    references: [users.id],
  }),
}));

export const snippetCommentsRelations = relations(snippetComments, ({ one, many }) => ({
  snippet: one(snippets, {
    fields: [snippetComments.snippet_id],
    references: [snippets.id],
  }),
  user: one(users, {
    fields: [snippetComments.user_id],
    references: [users.id],
  }),
  parent: one(snippetComments, {
    fields: [snippetComments.parent_id],
    references: [snippetComments.id],
  }),
  replies: many(snippetComments),
}));

// Schemas
export const insertSnippetSchema = createInsertSchema(snippets).omit({
  createdAt: true,
  likes_count: true,
  comments_count: true,
  metadata: true,
});

export const insertCommentSchema = createInsertSchema(snippetComments).omit({
  createdAt: true,
  metadata: true,
});

export const insertLikeSchema = createInsertSchema(snippetLikes).omit({
  createdAt: true,
});

// Types
export type Snippet = typeof snippets.$inferSelect;
export type NewSnippet = typeof snippets.$inferInsert;
export type SnippetComment = typeof snippetComments.$inferSelect;
export type NewSnippetComment = typeof snippetComments.$inferInsert;
export type SnippetLike = typeof snippetLikes.$inferSelect;
export type NewSnippetLike = typeof snippetLikes.$inferInsert;

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