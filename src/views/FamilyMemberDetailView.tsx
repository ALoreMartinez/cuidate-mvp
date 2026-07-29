import { useEffect, useState } from 'react';
import { ArrowLeft, Stethoscope, Pill, Activity, Clock } from 'lucide-react';
import { api, type FamilyMemberDetail, type VitalSignMetric } from '../api/client';
import { formatDateTime } from '../lib/format';

interface Props {
  familyMemberId: string;
  onBack: () => void;
}

const VITAL_METRIC_LABEL: Record<VitalSignMetric, string> = {
  blood_pressure: 'Presión arterial',
  heart_rate: 'Frecuencia cardíaca',
  oxygen_saturation: 'Saturación de oxígeno',
};

const VITAL_METRIC_UNIT: Record<VitalSignMetric, string> = {
  blood_pressure: 'mmHg',
  heart_rate: 'lpm',
  oxygen_saturation: '% SpO2',
};

const VITAL_METRIC_ORDER: VitalSignMetric[] = ['blood_pressure', 'heart_rate', 'oxygen_saturation'];

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function formatPlainDate(dateStr: string | null): string {
  if (!dateStr) return 'Fecha no registrada';
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${day} ${MESES[month - 1]} ${year}`;
}

export function FamilyMemberDetailView({ familyMemberId, onBack }: Props) {
  const [detail, setDetail] = useState<FamilyMemberDetail | null>(null);

  useEffect(() => {
    api.getFamilyMemberDetail(familyMemberId).then(setDetail);
  }, [familyMemberId]);

  if (!detail) {
    return <div className="flex-1 flex items-center justify-center text-sm text-gray-500">Cargando...</div>;
  }

  const vitalGroups = VITAL_METRIC_ORDER.map((metric) => ({
    metric,
    range: detail.vitalSignRanges.find((r) => r.metric === metric) ?? null,
    readings: detail.vitalSignReadings.filter((r) => r.metric === metric).slice().reverse(),
  })).filter((group) => group.readings.length > 0 || group.range);

  return (
    <div className="flex flex-col h-full bg-cyber-lavender/40">
      <header className="sticky top-0 z-40 bg-cyber-lavender/40/90 backdrop-blur-md px-4 pt-12 pb-4 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-blue-50 active:scale-95 transition-all">
          <ArrowLeft size={24} className="text-ultra-indigo" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-ultra-indigo mr-8 font-display tracking-tight">
          Detalle de {detail.name}
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-8 scrollbar-hide px-4 pt-4 flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-negro px-1 font-display tracking-tight">
            <Stethoscope size={20} className="text-orange-600" />
            Diagnósticos
          </h2>
          {detail.diagnostics.length === 0 ? (
            <p className="text-sm text-gray-500 px-1">Sin diagnósticos registrados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {detail.diagnostics.map((dx) => (
                <div key={dx.id} className="bg-white rounded-[16px] p-4 shadow-float/40 flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[15px] font-semibold text-negro">{dx.disease}</p>
                    {dx.status && (
                      <span className="bg-cyber-lavender text-ultra-indigo text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider shrink-0">
                        {dx.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Diagnosticado el {formatPlainDate(dx.diagnostic_date)}
                    {dx.specialist ? ` · ${dx.specialist}` : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-negro px-1 font-display tracking-tight">
            <Pill size={20} className="text-ultra-indigo" />
            Medicamentos
          </h2>
          {detail.medications.length === 0 ? (
            <p className="text-sm text-gray-500 px-1">Sin medicamentos activos.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {detail.medications.map((med) => (
                <div key={med.id} className="bg-white rounded-[16px] p-4 shadow-float/40 flex flex-col gap-1.5">
                  <p className="text-[15px] font-semibold text-negro">
                    {med.name}
                    {med.dose ? ` · ${med.dose}` : ''}
                    {med.form ? ` (${med.form})` : ''}
                  </p>
                  {med.frequency && <p className="text-sm text-gray-700">{med.frequency}</p>}
                  {med.schedule && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={14} />
                      <span>{med.schedule === 'conditional' ? 'Según necesidad' : med.schedule}</span>
                    </div>
                  )}
                  {med.target_disease && (
                    <p className="text-xs text-gray-400 mt-0.5">Para: {med.target_disease}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-negro px-1 font-display tracking-tight">
            <Activity size={20} className="text-lime-700" />
            Signos vitales
          </h2>
          {vitalGroups.length === 0 ? (
            <p className="text-sm text-gray-500 px-1">Sin signos vitales registrados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {vitalGroups.map(({ metric, range, readings }) => (
                <div key={metric} className="bg-white rounded-[16px] p-4 shadow-float/40 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[15px] font-semibold text-negro">{VITAL_METRIC_LABEL[metric]}</p>
                    {range?.min_ideal && range?.max_ideal && (
                      <span className="text-xs text-gray-500">
                        Meta: {range.min_ideal}–{range.max_ideal} {VITAL_METRIC_UNIT[metric]}
                      </span>
                    )}
                  </div>
                  {readings.length > 0 && (
                    <div className="flex flex-col divide-y divide-gray-100">
                      {readings.map((reading) => (
                        <div key={reading.id} className="flex items-center justify-between py-2 text-sm">
                          <span className="text-gray-500">{formatDateTime(reading.taken_at)}</span>
                          <span className="font-semibold text-negro">
                            {reading.value} {VITAL_METRIC_UNIT[metric]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
