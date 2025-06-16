import {
    jsonb,
    pgEnum,
    pgSchema,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

// supabase 에 이미 있지만 fk로 쓰기 위해 필요한 코드
const users = pgSchema("auth").table("users", {
    id: uuid().primaryKey(),
});

export const roles = pgEnum("role", [
    "developer",
    "designer",
    "marketer",
    "founder",
    "product-manager",
]);

export const profiles = pgTable("profiles", {
    profile_id: uuid()
        .primaryKey()
        .references(() => users.id, { onDelete: "cascade" }),
    avatar: text(),
    name: text().notNull(),
    username: text().notNull(),
    headline: text(),
    bio: text(),
    role: roles().default("developer").notNull(),
    stats: jsonb().$type<{
        followers: number;
        following: number;
    }>(),
    views: jsonb(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
});

export const follows = pgTable("follows", {
    follower_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
    }),
    following_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
    }),
    created_at: timestamp().notNull().defaultNow(),
});