import { Router } from 'express';
import { db } from '../db/connection.ts';
import { requireAuth } from '../middleware/requireAuth.ts';

export const appointmentsRouter = Router();
appointmentsRouter.use(requireAuth);

function parseAppointment(row: any) {
  return { ...row, instructions: JSON.parse(row.instructions_json || '[]') };
}

appointmentsRouter.get('/', (req, res) => {
  const { familyMemberId } = req.query as { familyMemberId?: string };
  let sql = `SELECT * FROM appointments WHERE user_id = ?`;
  const params: string[] = [req.user!.id];
  if (familyMemberId) {
    sql += ' AND family_member_id = ?';
    params.push(familyMemberId);
  }
  sql += ' ORDER BY starts_at ASC';
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(parseAppointment));
});

appointmentsRouter.get('/:id', (req, res) => {
  const row = db
    .prepare(`SELECT * FROM appointments WHERE id = ? AND user_id = ?`)
    .get(req.params.id, req.user!.id);
  if (!row) {
    res.status(404).json({ error: 'Cita no encontrada.' });
    return;
  }

  const linkedDocuments = db
    .prepare(
      `SELECT d.*, ad.added_by FROM appointment_documents ad
       JOIN documents d ON d.id = ad.document_id
       WHERE ad.appointment_id = ?`
    )
    .all(req.params.id);

  res.json({ ...parseAppointment(row), documents: linkedDocuments });
});

appointmentsRouter.post('/:id/documents', (req, res) => {
  const { documentId } = req.body as { documentId: string };
  const appointment = db
    .prepare('SELECT id FROM appointments WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user!.id);
  const document = db
    .prepare('SELECT id FROM documents WHERE id = ? AND user_id = ?')
    .get(documentId, req.user!.id);
  if (!appointment || !document) {
    res.status(404).json({ error: 'Cita o documento no encontrado.' });
    return;
  }

  db.prepare(
    `INSERT OR IGNORE INTO appointment_documents (appointment_id, document_id, added_by) VALUES (?, ?, 'manual')`
  ).run(req.params.id, documentId);
  res.status(201).json({ ok: true });
});

appointmentsRouter.delete('/:id/documents/:documentId', (req, res) => {
  db.prepare(
    `DELETE FROM appointment_documents WHERE appointment_id = ? AND document_id = ?`
  ).run(req.params.id, req.params.documentId);
  res.json({ ok: true });
});
