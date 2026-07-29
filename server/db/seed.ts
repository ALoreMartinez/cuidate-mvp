import fs from 'node:fs';
import path from 'node:path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { db } from './connection.ts';
import { env } from '../config/env.ts';

export const DEV_USER_ID = 'dev-user-mvp';

async function makePlaceholderPdf(title: string, subtitle: string): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([420, 594]);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawText(title, { x: 40, y: 520, size: 18, font, color: rgb(0.05, 0.02, 0.4) });
  page.drawText(subtitle, { x: 40, y: 495, size: 12, font: bodyFont, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('Documento de ejemplo generado por el seed de Cuidate MVP.', {
    x: 40,
    y: 460,
    size: 10,
    font: bodyFont,
    color: rgb(0.5, 0.5, 0.5),
  });
  return Buffer.from(await pdf.save());
}

function insertDocument(row: {
  id: string;
  category: 'formula' | 'analisis' | 'imagen' | 'otro';
  title: string;
  providerLabel: string;
  specialty: string | null;
  docDate: string;
  status: 'pending_review' | 'confirmed';
  fileBuffer: Buffer;
}) {
  const dir = path.join(env.UPLOADS_DIR, DEV_USER_ID);
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${row.id}.pdf`;
  fs.writeFileSync(path.join(dir, filename), row.fileBuffer);
  const relativeStoragePath = path.posix.join(DEV_USER_ID, filename);

  db.prepare(
    `INSERT INTO documents
      (id, user_id, source_type, status, category, title, provider_label, specialty, doc_date,
       original_filename, storage_path, mime_type, size_bytes)
     VALUES (?, ?, 'manual_upload', ?, ?, ?, ?, ?, ?, ?, ?, 'application/pdf', ?)`
  ).run(
    row.id,
    DEV_USER_ID,
    row.status,
    row.category,
    row.title,
    row.providerLabel,
    row.specialty,
    row.docDate,
    row.title,
    relativeStoragePath,
    row.fileBuffer.byteLength
  );
}

export async function seedIfEmpty() {
  const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(DEV_USER_ID);
  if (existing) return;

  db.prepare(
    `INSERT INTO users (id, email, name) VALUES (?, ?, ?)`
  ).run(DEV_USER_ID, 'demo@cuidate.mvp', 'Usuario');

  const appt1 = crypto.randomUUID();
  const appt2 = crypto.randomUUID();

  db.prepare(
    `INSERT INTO appointments
      (id, user_id, specialty, doctor_name, location_name, location_address, starts_at, status, instructions_json)
     VALUES (?, ?, 'Cardiología', 'Dra. Elena Rivas', 'Centro Médico Central',
             'Consultorio 402, Piso 4, Av. Principal 123, Ciudad', ?, 'confirmada', ?)`
  ).run(
    appt1,
    DEV_USER_ID,
    new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    JSON.stringify([
      'Ayuno de 8 horas requerido antes de la cita.',
      'Traer estudios previos de laboratorio y ecocardiograma.',
    ])
  );

  db.prepare(
    `INSERT INTO appointments
      (id, user_id, specialty, doctor_name, location_name, location_address, starts_at, status, instructions_json)
     VALUES (?, ?, 'Dermatología', 'Dr. Carlos Perez', NULL, NULL, ?, 'pendiente', '[]')`
  ).run(appt2, DEV_USER_ID, new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString());

  const docAnalisis = crypto.randomUUID();
  const docOrden = crypto.randomUUID();
  const docRayosX = crypto.randomUUID();

  insertDocument({
    id: docAnalisis,
    category: 'analisis',
    title: 'Análisis de sangre completo',
    providerLabel: 'Laboratorio Central',
    specialty: 'Cardiología',
    docDate: '2026-10-12',
    status: 'pending_review',
    fileBuffer: await makePlaceholderPdf('Análisis de sangre completo', 'Laboratorio Central · 12 Oct'),
  });

  insertDocument({
    id: docOrden,
    category: 'formula',
    title: 'Orden médica Cardiología',
    providerLabel: 'Dra. Elena Rivas',
    specialty: 'Cardiología',
    docDate: '2026-10-10',
    status: 'pending_review',
    fileBuffer: await makePlaceholderPdf('Orden médica Cardiología', 'Dra. Elena Rivas · 10 Oct'),
  });

  insertDocument({
    id: docRayosX,
    category: 'imagen',
    title: 'Radiografía de Tórax',
    providerLabel: 'Centro Radiológico',
    specialty: null,
    docDate: '2026-09-05',
    status: 'confirmed',
    fileBuffer: await makePlaceholderPdf('Radiografía de Tórax', 'Centro Radiológico · 05 Sep'),
  });

  db.prepare(
    `INSERT INTO appointment_documents (appointment_id, document_id, added_by) VALUES (?, ?, 'manual')`
  ).run(appt1, docOrden);
  db.prepare(
    `INSERT INTO appointment_documents (appointment_id, document_id, added_by) VALUES (?, ?, 'manual')`
  ).run(appt1, docAnalisis);
}
