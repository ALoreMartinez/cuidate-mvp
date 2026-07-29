import type { NextFunction, Request, Response } from 'express';
import { DEV_USER_ID } from '../db/seed.ts';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

/**
 * Fase 0-2: stub de dev-user, sin sesión real. Se reemplaza por auth real
 * (Google Sign-In, ver decisions/decisiones.md) en la Fase 3.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  req.user = { id: DEV_USER_ID };
  next();
}
