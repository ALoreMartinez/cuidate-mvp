import { Router } from 'express';
import { db } from '../db/connection.ts';
import { requireAuth } from '../middleware/requireAuth.ts';
import { upload } from '../middleware/upload.ts';
import { createDownloadToken } from '../services/signedUrl.service.ts';
import path from 'node:path';

export const documentsRouter = Router();
documentsRouter.use(requireAuth);

documentsRouter.get('/', (req, res) => {
  const { status, category } = req.query as { status?: string; category?: string };
  let sql = 'SELECT * FROM documents WHERE user_id = ?';
  const params: string[] = [req.user!.id];
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  } else {
    // Sin filtro explícito, nunca mostrar descartados en el listado normal.
    sql += " AND status != 'discarded'";
  }
  if (category && category !== 'todos') {
    sql += ' AND category = ?';
    params.push(category);
  }
  sql += ' ORDER BY created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

documentsRouter.get('/pending-count', (req, res) => {
  const row = db
    .prepare(`SELECT COUNT(*) as count FROM documents WHERE user_id = ? AND status = 'pending_review'`)
    .get(req.user!.id) as { count: number };
  res.json({ count: row.count });
});

documentsRouter.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No se recibió ningún archivo.' });
    return;
  }

  const id = crypto.randomUUID();
  const title = (req.body.title as string) || req.file.originalname;
  const relativePath = path.posix.join(req.user!.id, req.file.filename);

  db.prepare(
    `INSERT INTO documents
      (id, user_id, source_type, status, category, title, original_filename, storage_path, mime_type, size_bytes)
     VALUES (?, ?, 'manual_upload', 'pending_review', NULL, ?, ?, ?, ?, ?)`
  ).run(id, req.user!.id, title, req.file.originalname, relativePath, req.file.mimetype, req.file.size);

  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(id);
  res.status(201).json(doc);
});

documentsRouter.get('/:id/download-url', (req, res) => {
  const doc = db
    .prepare('SELECT id FROM documents WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user!.id);
  if (!doc) {
    res.status(404).json({ error: 'Documento no encontrado.' });
    return;
  }
  const token = createDownloadToken({ resourceType: 'document', resourceId: req.params.id, userId: req.user!.id });
  res.json({ downloadUrl: `/api/files/${token}` });
});

documentsRouter.patch('/:id', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user!.id);
  if (!existing) {
    res.status(404).json({ error: 'Documento no encontrado.' });
    return;
  }

  const { category, status, title, provider_label, specialty, doc_date } = req.body as Record<string, string>;
  db.prepare(
    `UPDATE documents SET
       category = COALESCE(?, category),
       status = COALESCE(?, status),
       title = COALESCE(?, title),
       provider_label = COALESCE(?, provider_label),
       specialty = COALESCE(?, specialty),
       doc_date = COALESCE(?, doc_date),
       updated_at = datetime('now')
     WHERE id = ?`
  ).run(category ?? null, status ?? null, title ?? null, provider_label ?? null, specialty ?? null, doc_date ?? null, req.params.id);

  res.json(db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id));
});
