import fs from 'node:fs';
import { db } from './connection.ts';
import { env } from '../config/env.ts';
import { DEV_USER_ID } from './seed.ts';

// URLs de Unsplash ya verificadas visualmente (ver decisions/design.md) — reutilizadas del
// mock que antes vivía en src/views/HomeView.tsx.
const AVATAR_BY_NAME: Record<string, string> = {
  Angie: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
  Epaminondas: 'https://images.unsplash.com/photo-1533101585792-27f81a845550?q=80&w=150&auto=format&fit=crop',
  Abigail: 'https://images.unsplash.com/photo-1498757581981-8ddb3c0b9b07?q=80&w=150&auto=format&fit=crop',
  Gloria: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop',
};

const RELATIONSHIP_LABEL: Record<string, string> = {
  self: 'Mi perfil',
  mother: 'Mamá',
  father: 'Papá',
  grandfather: 'Abuelo',
  grandmother: 'Abuela',
};

type VitalMetric = 'blood_pressure' | 'heart_rate' | 'oxygen_saturation';
const VITAL_METRICS: VitalMetric[] = ['blood_pressure', 'heart_rate', 'oxygen_saturation'];

interface SeedDiagnostic {
  disease: string;
  diagnostic_date?: string;
  specialist?: string;
  status?: string;
}

interface SeedMedication {
  name: string;
  dose?: string;
  form?: string;
  frequency?: string;
  schedule?: string;
  target_disease?: string;
}

interface SeedVitalRange {
  min_ideal: string | number;
  max_ideal: string | number;
}

interface SeedMember {
  name: string;
  relationship: string;
  age?: number;
  eps?: string;
  regime?: string;
  diagnostics?: SeedDiagnostic[];
  medications?: SeedMedication[];
  vital_signs_ranges?: Partial<Record<VitalMetric, SeedVitalRange>>;
}

interface SeedDataset {
  members: SeedMember[];
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomReadingValue(metric: VitalMetric, minIdeal: string | number, maxIdeal: string | number): string {
  if (metric === 'blood_pressure') {
    const [minSys, minDia] = String(minIdeal).split('/').map(Number);
    const [maxSys, maxDia] = String(maxIdeal).split('/').map(Number);
    return `${randomInRange(minSys, maxSys)}/${randomInRange(minDia, maxDia)}`;
  }
  return String(randomInRange(Number(minIdeal), Number(maxIdeal)));
}

function daysAgoIso(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function daysFromNowIso(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}

export function seedFamilyHealthIfEmpty() {
  const already = db.prepare('SELECT id FROM family_members WHERE user_id = ?').get(DEV_USER_ID);
  if (already) return;

  if (!fs.existsSync(env.FAMILY_HEALTH_SEED_PATH)) {
    console.log('[seed] Sin dataset familiar privado en', env.FAMILY_HEALTH_SEED_PATH, '— se omite.');
    return;
  }

  const dataset: SeedDataset = JSON.parse(fs.readFileSync(env.FAMILY_HEALTH_SEED_PATH, 'utf-8'));

  for (const member of dataset.members) {
    const memberId = crypto.randomUUID();
    const relationshipLabel = RELATIONSHIP_LABEL[member.relationship] ?? member.relationship;

    db.prepare(
      `INSERT INTO family_members (id, user_id, name, relationship, age, eps, regime, avatar_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      memberId,
      DEV_USER_ID,
      member.name,
      relationshipLabel,
      member.age ?? null,
      member.eps ?? null,
      member.regime ?? null,
      AVATAR_BY_NAME[member.name] ?? null
    );

    for (const dx of member.diagnostics ?? []) {
      db.prepare(
        `INSERT INTO diagnostics (id, family_member_id, disease, diagnostic_date, specialist, status)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(crypto.randomUUID(), memberId, dx.disease, dx.diagnostic_date ?? null, dx.specialist ?? null, dx.status ?? null);
    }

    for (const med of member.medications ?? []) {
      db.prepare(
        `INSERT INTO medications (id, family_member_id, name, dose, form, frequency, schedule, target_disease)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        crypto.randomUUID(),
        memberId,
        med.name,
        med.dose ?? null,
        med.form ?? null,
        med.frequency ?? null,
        med.schedule ?? null,
        med.target_disease ?? null
      );
    }

    const ranges = member.vital_signs_ranges ?? {};
    for (const metric of VITAL_METRICS) {
      const range = ranges[metric];
      if (!range) continue;

      db.prepare(
        `INSERT INTO vital_sign_ranges (id, family_member_id, metric, min_ideal, max_ideal)
         VALUES (?, ?, ?, ?, ?)`
      ).run(crypto.randomUUID(), memberId, metric, String(range.min_ideal), String(range.max_ideal));

      // Historial de 7 días (una lectura diaria) para que la card de "Signos Vitales"
      // refleje una medición real en vez de solo el rango ideal.
      for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
        db.prepare(
          `INSERT INTO vital_sign_readings (id, family_member_id, metric, value, taken_at)
           VALUES (?, ?, ?, ?, ?)`
        ).run(crypto.randomUUID(), memberId, metric, randomReadingValue(metric, range.min_ideal, range.max_ideal), daysAgoIso(daysAgo));
      }
    }

    if (member.relationship !== 'self') {
      const specialists = [...new Set((member.diagnostics ?? []).map((d) => d.specialist).filter(Boolean))].slice(0, 2) as string[];
      specialists.forEach((specialist, i) => {
        db.prepare(
          `INSERT INTO appointments
             (id, user_id, family_member_id, specialty, doctor_name, location_name, location_address, starts_at, status, instructions_json)
           VALUES (?, ?, ?, ?, 'Por confirmar', NULL, NULL, ?, 'pendiente', '[]')`
        ).run(crypto.randomUUID(), DEV_USER_ID, memberId, specialist, daysFromNowIso(7 + i * 14));
      });
    }
  }

  console.log('[seed] Dataset familiar privado cargado:', dataset.members.length, 'familiares.');
}
