// import { pgTable, integer, varchar, boolean, text } from "drizzle-orm/pg-core";
// import { timestamps } from "./common";



// export const users = pgTable("users", {
//   id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
//   name: varchar({ length: 255 }).notNull(),
//   age: integer(),
//   email: varchar({ length: 255 }).notNull().unique(),
//   emailVerified: boolean().notNull(),
//   image: text(),
//   role: varchar({ length: 255 }),
//   ...timestamps
// });
