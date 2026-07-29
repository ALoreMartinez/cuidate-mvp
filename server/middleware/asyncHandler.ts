import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Express 4 no captura rechazos de promesas en handlers `async` — un throw dentro de uno
 * se convierte en unhandledRejection y puede tumbar todo el proceso (pasó con un PDF corrupto
 * en pdfMerge.service.ts). Envolver todo handler async con esto para que el error llegue a
 * errorHandler en vez de crashear el servidor.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
