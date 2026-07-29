import path from 'node:path';
import { env } from '../config/env.ts';

export function uploadsPath(relativePath: string): string {
  return path.resolve(env.UPLOADS_DIR, relativePath);
}

export function packagesPath(relativePath: string): string {
  return path.resolve(env.PACKAGES_DIR, relativePath);
}
