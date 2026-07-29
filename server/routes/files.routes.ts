import { Router } from 'express';
import { resolveDownloadToken } from '../services/signedUrl.service.ts';
import { uploadsPath, packagesPath } from '../services/storage.service.ts';
import { db } from '../db/connection.ts';

export const filesRouter = Router();

filesRouter.get('/:token', (req, res) => {
  const tokenRow = resolveDownloadToken(req.params.token);
  if (!tokenRow) {
    res.status(404).send('Enlace inválido o expirado.');
    return;
  }

  if (tokenRow.resource_type === 'document') {
    const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(tokenRow.resource_id) as
      | { storage_path: string; mime_type: string; original_filename: string }
      | undefined;
    if (!doc) {
      res.status(404).send('Documento no encontrado.');
      return;
    }
    res.type(doc.mime_type);
    res.sendFile(uploadsPath(doc.storage_path));
    return;
  }

  const pkg = db.prepare('SELECT * FROM print_packages WHERE id = ?').get(tokenRow.resource_id) as
    | { merged_pdf_path: string }
    | undefined;
  if (!pkg) {
    res.status(404).send('Paquete no encontrado.');
    return;
  }
  res.type('application/pdf');
  res.sendFile(packagesPath(pkg.merged_pdf_path));
});
