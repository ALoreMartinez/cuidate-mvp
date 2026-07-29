CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS oauth_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  provider TEXT NOT NULL CHECK (provider IN ('google','microsoft')),
  provider_account_id TEXT NOT NULL,
  access_token_enc TEXT NOT NULL,
  refresh_token_enc TEXT,
  token_iv TEXT,
  scope TEXT,
  expires_at TEXT,
  revoked_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS email_ingest_state (
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google','microsoft')),
  cursor TEXT,
  last_polled_at TEXT,
  PRIMARY KEY (user_id, provider)
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  source_type TEXT NOT NULL CHECK (source_type IN ('manual_upload','email_gmail','email_outlook','whatsapp_share')),
  source_ref TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review','confirmed','discarded')),
  category TEXT CHECK (category IN ('formula','analisis','imagen','otro')),
  title TEXT NOT NULL,
  provider_label TEXT,
  specialty TEXT,
  doc_date TEXT,
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  extraction_confidence REAL,
  extraction_raw_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, source_ref)
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  specialty TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  location_name TEXT,
  location_address TEXT,
  starts_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('confirmada','pendiente','completada','cancelada')),
  instructions_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS appointment_documents (
  appointment_id TEXT NOT NULL REFERENCES appointments(id),
  document_id TEXT NOT NULL REFERENCES documents(id),
  added_by TEXT NOT NULL DEFAULT 'manual' CHECK (added_by IN ('auto','manual')),
  PRIMARY KEY (appointment_id, document_id)
);

CREATE TABLE IF NOT EXISTS print_packages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  appointment_id TEXT REFERENCES appointments(id),
  merged_pdf_path TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS print_package_documents (
  print_package_id TEXT NOT NULL REFERENCES print_packages(id),
  document_id TEXT NOT NULL REFERENCES documents(id),
  order_index INTEGER NOT NULL,
  PRIMARY KEY (print_package_id, document_id)
);

CREATE TABLE IF NOT EXISTS print_package_deliveries (
  id TEXT PRIMARY KEY,
  print_package_id TEXT NOT NULL REFERENCES print_packages(id),
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp','email','share')),
  recipient TEXT,
  status TEXT NOT NULL DEFAULT 'link_generated',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS download_tokens (
  token TEXT PRIMARY KEY,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('document','print_package')),
  resource_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
