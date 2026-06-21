import {  uuid,varchar,pgTable , integer, timestamp} from "drizzle-orm/pg-core";

export const files = pgTable('files', {
     id: uuid('id').defaultRandom().primaryKey(),
    filename: varchar('filename', { length: 255 }).notNull(),
    mimeType: varchar('mime_type', { length: 127 }).notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    storageKey: varchar('storage_key', { length: 512 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),

})

export type File = typeof files.$inferSelect;       // TypeScript type for SELECT
export type NewFile = typeof files.$inferInsert;    // TypeScript type for INSERT