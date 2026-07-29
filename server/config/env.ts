import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  // Nombre deliberadamente distinto de PORT: el harness de preview inyecta PORT=3000
  // para el dev server de Vite; si el backend también leyera PORT, competirían por el
  // mismo puerto.
  SERVER_PORT: z.coerce.number().default(8787),
  DATABASE_PATH: z.string().default('./storage/db/cuidate.sqlite'),
  UPLOADS_DIR: z.string().default('./storage/uploads'),
  PACKAGES_DIR: z.string().default('./storage/packages'),
  FAMILY_HEALTH_SEED_PATH: z.string().default('./storage/private/family-health.seed.json'),
  JWT_SECRET: z.string().default('dev-insecure-secret-change-me'),
  ENCRYPTION_KEY: z.string().optional(),
  SIGNED_URL_TTL_HOURS: z.coerce.number().default(48),
  RESEND_API_KEY: z.string().optional(),
});

export const env = schema.parse(process.env);
