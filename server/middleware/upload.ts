import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { env } from '../config/env.ts';

const ALLOWED_MIME = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif']);

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const dir = path.join(env.UPLOADS_DIR, req.user!.id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
      return;
    }
    cb(null, true);
  },
});
