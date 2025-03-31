import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '@/server/db/sqlite/schema';

export const db = drizzle(process.env.DATABASE_URL_DEV!, {schema: schema});
