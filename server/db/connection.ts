import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env.ts';

fs.mkdirSync(path.dirname(env.DATABASE_PATH), { recursive: true });
fs.mkdirSync(env.UPLOADS_DIR, { recursive: true });
fs.mkdirSync(env.PACKAGES_DIR, { recursive: true });

export const db = new DatabaseSync(env.DATABASE_PATH);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

const migrationsDir = path.resolve(import.meta.dirname, 'migrations');
const migrationFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
for (const file of migrationFiles) {
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
  try {
    db.exec(sql);
  } catch (err) {
    // Las migraciones corren en cada boot (no hay tabla de control) y CREATE TABLE IF NOT
    // EXISTS tolera eso, pero ALTER TABLE ... ADD COLUMN no soporta IF NOT EXISTS en
    // node:sqlite — truena con "duplicate column name" desde el segundo arranque. Es el
    // único caso de no-idempotencia conocido en este formato de migraciones, así que se
    // ignora puntualmente.
    const isDuplicateColumn = err instanceof Error && /duplicate column name/i.test(err.message);
    if (!isDuplicateColumn) throw err;
  }
}
