import { Router } from 'express';
import { db } from '../db/connection.ts';
import { requireAuth } from '../middleware/requireAuth.ts';

export const familyMembersRouter = Router();
familyMembersRouter.use(requireAuth);

familyMembersRouter.get('/', (req, res) => {
  const rows = db
    .prepare(`SELECT * FROM family_members WHERE user_id = ? ORDER BY created_at ASC`)
    .all(req.user!.id);
  res.json(rows);
});

familyMembersRouter.get('/:id', (req, res) => {
  const member = db
    .prepare(`SELECT * FROM family_members WHERE id = ? AND user_id = ?`)
    .get(req.params.id, req.user!.id);
  if (!member) {
    res.status(404).json({ error: 'Familiar no encontrado.' });
    return;
  }

  const diagnostics = db
    .prepare(`SELECT * FROM diagnostics WHERE family_member_id = ? ORDER BY diagnostic_date DESC`)
    .all(req.params.id);
  const medications = db
    .prepare(`SELECT * FROM medications WHERE family_member_id = ? ORDER BY created_at ASC`)
    .all(req.params.id);
  const vitalSignRanges = db
    .prepare(`SELECT * FROM vital_sign_ranges WHERE family_member_id = ?`)
    .all(req.params.id);
  const vitalSignReadings = db
    .prepare(`SELECT * FROM vital_sign_readings WHERE family_member_id = ? ORDER BY taken_at ASC`)
    .all(req.params.id);

  res.json({ ...member, diagnostics, medications, vitalSignRanges, vitalSignReadings });
});
