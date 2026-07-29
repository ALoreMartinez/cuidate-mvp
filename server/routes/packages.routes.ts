import fs from 'node:fs/promises';
import path from 'node:path';
import { Router } from 'express';
import { db } from '../db/connection.ts';
import { requireAuth } from '../middleware/requireAuth.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { mergeDocumentsToPdf } from '../services/pdfMerge.service.ts';
import { packagesPath } from '../services/storage.service.ts';
import { createDownloadToken } from '../services/signedUrl.service.ts';
import { buildWhatsAppLink, sendPackageEmail } from '../services/notify.service.ts';

export const packagesRouter = Router();
packagesRouter.use(requireAuth);

packagesRouter.post('/', asyncHandler(async (req, res) => {
  const { appointmentId, documentIds } = req.body as { appointmentId?: string; documentIds: string[] };
  if (!documentIds?.length) {
    res.status(400).json({ error: 'Selecciona al menos un documento.' });
    return;
  }

  const placeholders = documentIds.map(() => '?').join(',');
  const docs = db
    .prepare(`SELECT * FROM documents WHERE user_id = ? AND id IN (${placeholders})`)
    .all(req.user!.id, ...documentIds) as Array<{ id: string; storage_path: string; mime_type: string; title: string }>;

  if (docs.length !== documentIds.length) {
    res.status(404).json({ error: 'Alguno de los documentos no existe.' });
    return;
  }
  // Conserva el orden pedido por el cliente, no el orden de la consulta SQL.
  const ordered = documentIds.map((id) => docs.find((d) => d.id === id)!);

  const mergedBuffer = await mergeDocumentsToPdf(ordered);
  const packageId = crypto.randomUUID();
  const filename = `${packageId}.pdf`;
  await fs.writeFile(packagesPath(filename), mergedBuffer);

  db.prepare(
    `INSERT INTO print_packages (id, user_id, appointment_id, merged_pdf_path) VALUES (?, ?, ?, ?)`
  ).run(packageId, req.user!.id, appointmentId ?? null, filename);

  ordered.forEach((doc, index) => {
    db.prepare(
      `INSERT INTO print_package_documents (print_package_id, document_id, order_index) VALUES (?, ?, ?)`
    ).run(packageId, doc.id, index);
  });

  const token = createDownloadToken({ resourceType: 'print_package', resourceId: packageId, userId: req.user!.id });
  res.status(201).json({ id: packageId, downloadUrl: `/api/files/${token}` });
}));

packagesRouter.get('/:id', (req, res) => {
  const pkg = db
    .prepare('SELECT * FROM print_packages WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user!.id);
  if (!pkg) {
    res.status(404).json({ error: 'Paquete no encontrado.' });
    return;
  }
  const deliveries = db
    .prepare('SELECT * FROM print_package_deliveries WHERE print_package_id = ? ORDER BY created_at DESC')
    .all(req.params.id);
  res.json({ ...pkg, deliveries });
});

packagesRouter.post('/:id/send', asyncHandler(async (req, res) => {
  const { channel, recipient } = req.body as { channel: 'whatsapp' | 'email' | 'share'; recipient?: string };
  const pkg = db
    .prepare('SELECT * FROM print_packages WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user!.id) as { id: string; appointment_id: string | null } | undefined;
  if (!pkg) {
    res.status(404).json({ error: 'Paquete no encontrado.' });
    return;
  }

  const token = createDownloadToken({ resourceType: 'print_package', resourceId: pkg.id, userId: req.user!.id });
  const downloadUrl = `${req.protocol}://${req.get('host')}/api/files/${token}`;

  let result: Record<string, unknown> = {};
  if (channel === 'whatsapp') {
    const link = buildWhatsAppLink({
      phone: recipient,
      message: `Hola, adjunto mis documentos para imprimir: ${downloadUrl}`,
    });
    result = { link };
  } else if (channel === 'email') {
    if (!recipient) {
      res.status(400).json({ error: 'Falta el correo destinatario.' });
      return;
    }
    result = await sendPackageEmail({ to: recipient, downloadUrl });
  } else {
    result = { downloadUrl };
  }

  const deliveryId = crypto.randomUUID();
  db.prepare(
    `INSERT INTO print_package_deliveries (id, print_package_id, channel, recipient, status) VALUES (?, ?, ?, ?, 'link_generated')`
  ).run(deliveryId, pkg.id, channel, recipient ?? null);

  res.status(201).json({ deliveryId, ...result });
}));
