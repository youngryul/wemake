import {
  bigint,
  check,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";
import { sql } from "drizzle-orm";

export const products = pgTable("products", {
  product_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  name: text().notNull(),
  tagline: text().notNull(),
  description: text().notNull(),
  how_it_works: text().notNull(),
  icon: text().notNull(),
  url: text().notNull(),
  stats: jsonb().notNull().default({ views: 0, reviews: 0 }),
  profile_id: uuid()
    .references(() => profiles.profile_id, { onDelete: "cascade" })
    .notNull(),
  category_id: bigint({ mode: "number" }).references(
    () => categories.category_id,
    { onDelete: "set null" }
  ),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  category_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  name: text().notNull(),
  description: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const product_upvotes = pgTable(
  "product_upvotes",
  {
    product_id: bigint({ mode: "number" }).references(
      () => products.product_id,
      {
        onDelete: "cascade",
      }
    ),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
  },
  (table) => [primaryKey({ columns: [table.product_id, table.profile_id] })] // 제약조건 (pk) 생성
);

export const reviews = pgTable(
  "reviews",
  {
    review_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    product_id: bigint({ mode: "number" }).references(
      () => products.product_id,
      {
        onDelete: "cascade",
      }
    ),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    rating: integer().notNull(),
    review: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [check("rating_check", sql`${table.rating} BETWEEN 1 AND 5`)]
);
