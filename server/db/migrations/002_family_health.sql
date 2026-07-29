CREATE TABLE IF NOT EXISTS family_members (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  age INTEGER,
  eps TEXT,
  regime TEXT,
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS diagnostics (
  id TEXT PRIMARY KEY,
  family_member_id TEXT NOT NULL REFERENCES family_members(id),
  disease TEXT NOT NULL,
  diagnostic_date TEXT,
  specialist TEXT,
  status TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS medications (
  id TEXT PRIMARY KEY,
  family_member_id TEXT NOT NULL REFERENCES family_members(id),
  name TEXT NOT NULL,
  dose TEXT,
  form TEXT,
  frequency TEXT,
  schedule TEXT,
  target_disease TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vital_sign_ranges (
  id TEXT PRIMARY KEY,
  family_member_id TEXT NOT NULL REFERENCES family_members(id),
  metric TEXT NOT NULL CHECK (metric IN ('blood_pressure','heart_rate','oxygen_saturation')),
  min_ideal TEXT,
  max_ideal TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vital_sign_readings (
  id TEXT PRIMARY KEY,
  family_member_id TEXT NOT NULL REFERENCES family_members(id),
  metric TEXT NOT NULL CHECK (metric IN ('blood_pressure','heart_rate','oxygen_saturation')),
  value TEXT NOT NULL,
  taken_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- node:sqlite no soporta "ADD COLUMN IF NOT EXISTS" y las migraciones corren en cada boot
-- (no hay tabla de control) — server/db/connection.ts ignora puntualmente el error
-- "duplicate column name" que este ALTER produce a partir del segundo arranque.
ALTER TABLE appointments ADD COLUMN family_member_id TEXT REFERENCES family_members(id);
