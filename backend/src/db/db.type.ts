// backend/src/db/db.types.ts
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { Pool } from 'pg';

export type Database = NodePgDatabase<typeof schema> & {$client: Pool};
