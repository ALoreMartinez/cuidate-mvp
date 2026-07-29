import crypto from 'node:crypto';
import { db } from '../db/connection.ts';
import { env } from '../config/env.ts';

export function createDownloadToken(params: {
  resourceType: 'document' | 'print_package';
  resourceId: string;
  userId: string;
}): string {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + env.SIGNED_URL_TTL_HOURS * 3600 * 1000).toISOString();
  db.prepare(
    `INSERT INTO download_tokens (token, resource_type, resource_id, user_id, expires_at) VALUES (?, ?, ?, ?, ?)`
  ).run(token, params.resourceType, params.resourceId, params.userId, expiresAt);
  return token;
}

export function resolveDownloadToken(token: string) {
  const row = db.prepare(`SELECT * FROM download_tokens WHERE token = ?`).get(token) as
    | { token: string; resource_type: string; resource_id: string; user_id: string; expires_at: string }
    | undefined;
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;
  return row;
}
