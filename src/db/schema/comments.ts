import { pgTable, text, integer, index, AnyPgColumn } from 'drizzle-orm/pg-core';
import { createInsertSchema } from "drizzle-zod";

import { z } from "zod";
import { snippets } from './snippets';
import { timestamps } from './common';
import { users } from './auth-schema';

export const comments = pgTable('comments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  content: text('content').notNull(),
  snippetId: integer('snippet_id')
    .notNull()
    .references(() => snippets.id),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  parentId: integer('parent_id')
    .references((): AnyPgColumn => comments.id),
  ...timestamps
}, (table) => ({
  snippetIdIdx: index('comment_snippet_idx').on(table.snippetId),
  userIdIdx: index('comment_user_idx').on(table.userId),
  parentIdIdx: index('comment_parent_idx').on(table.parentId)
}));

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
