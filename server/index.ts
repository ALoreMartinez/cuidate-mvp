import express from 'express';
import path from 'node:path';
import { env } from './config/env.ts';
import { db } from './db/connection.ts';
import { seedIfEmpty } from './db/seed.ts';
import { seedFamilyHealthIfEmpty } from './db/familyHealthSeed.ts';
import { documentsRouter } from './routes/documents.routes.ts';
import { appointmentsRouter } from './routes/appointments.routes.ts';
import { packagesRouter } from './routes/packages.routes.ts';
import { filesRouter } from './routes/files.routes.ts';
import { familyMembersRouter } from './routes/familyMembers.routes.ts';
import { errorHandler } from './middleware/errorHandler.ts';

// Backstop: un handler async sin envolver en asyncHandler.ts que rechace su promesa no
// debe tumbar todo el proceso (ver decisions/decisiones.md, 2026-07-22 — crash de pdfMerge).
// Los handlers deben seguir envolviéndose correctamente; esto es solo la última red.
process.on('unhandledRejection', (reason) => {
  console.error('[server] unhandledRejection (revisar asyncHandler en la ruta correspondiente):', reason);
});

await seedIfEmpty();
seedFamilyHealthIfEmpty();

const app = express();
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/documents', documentsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/print-packages', packagesRouter);
app.use('/api/files', filesRouter);
app.use('/api/family-members', familyMembersRouter);

const distDir = path.resolve(import.meta.dirname, 'dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

app.use(errorHandler);

app.listen(env.SERVER_PORT, () => {
  console.log(`[server] Cuidate MVP API escuchando en http://localhost:${env.SERVER_PORT}`);
});

process.on('exit', () => db.close());
