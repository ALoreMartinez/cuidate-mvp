import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Bell, Calendar, CalendarDays, ChevronRight, Camera, Pill, Stethoscope, Activity, Heart,
  Plus, Settings,
} from 'lucide-react';
import {
  api, type Appointment, type FamilyMember, type FamilyMemberDetail, type VitalSignMetric,
} from '../api/client';
import { formatDateTime, daysUntil } from '../lib/format';
import { SPECIALIST_ICON, FALLBACK_SPECIALIST_ICON } from '../lib/specialistIcons';
import type { View } from '../App';
import { EmptyState } from '../components/EmptyState';

interface Props {
  onNavigate: (view: View) => void;
  onUploadClick: () => void;
}

const UPCOMING_STATUSES = new Set<Appointment['status']>(['confirmada', 'pendiente']);
const APPOINTMENT_DURATION_MS = 2 * 60 * 60 * 1000;

const AVATAR_ROW_HEIGHT = 96;
const UNSELECTED_AVATAR_SIZE = 60;
const SELECTED_AVATAR_SIZE = 72;
const AVATAR_ARC_GAP = 6;
const AVATAR_ROW_CENTER_Y = AVATAR_ROW_HEIGHT / 2;
const AVATAR_BASELINE_Y = AVATAR_ROW_CENTER_Y + UNSELECTED_AVATAR_SIZE / 2 + AVATAR_ARC_GAP;

const VITAL_METRIC_UNIT: Record<VitalSignMetric, string> = {
  blood_pressure: 'mmHg',
  heart_rate: 'lpm',
  oxygen_saturation: '% SpO2',
};

function vitalStatus(value: string, metric: VitalSignMetric, minIdeal: string, maxIdeal: string): 'Normal' | 'Elevado' | 'Bajo' {
  if (metric === 'blood_pressure') {
    const [sys] = value.split('/').map(Number);
    const [minSys] = minIdeal.split('/').map(Number);
    const [maxSys] = maxIdeal.split('/').map(Number);
    if (sys > maxSys) return 'Elevado';
    if (sys < minSys) return 'Bajo';
    return 'Normal';
  }
  const numeric = Number(value);
  if (numeric > Number(maxIdeal)) return 'Elevado';
  if (numeric < Number(minIdeal)) return 'Bajo';
  return 'Normal';
}

export function HomeView({ onNavigate, onUploadClick }: Props) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [memberDetail, setMemberDetail] = useState<FamilyMemberDetail | null>(null);
  const [memberAppointments, setMemberAppointments] = useState<Appointment[]>([]);
  const [avatarConnector, setAvatarConnector] = useState<{ width: number; path: string } | null>(null);
  const avatarRowRef = useRef<HTMLDivElement>(null);
  const avatarRefs = useRef(new Map<string, HTMLDivElement>());

  useEffect(() => {
    api.getFamilyMembers().then((members) => {
      setFamilyMembers(members);
      setSelectedProfileId((prev) => prev ?? members[0]?.id ?? null);
    });
  }, []);

  useLayoutEffect(() => {
    const row = avatarRowRef.current;
    const selectedEl = selectedProfileId ? avatarRefs.current.get(selectedProfileId) : null;
    if (!row || !selectedEl) return;

    const width = row.scrollWidth;
    const rowRect = row.getBoundingClientRect();
    const elRect = selectedEl.getBoundingClientRect();
    const cx = elRect.left - rowRect.left + elRect.width / 2;
    const frameRadius = elRect.width / 2 + AVATAR_ARC_GAP;
    const dy = AVATAR_BASELINE_Y - AVATAR_ROW_CENTER_Y;
    const dx = Math.sqrt(Math.max(frameRadius * frameRadius - dy * dy, 0));
    setAvatarConnector({
      width,
      path: `M 0 ${AVATAR_BASELINE_Y} L ${cx - dx} ${AVATAR_BASELINE_Y} A ${frameRadius} ${frameRadius} 0 1 1 ${cx + dx} ${AVATAR_BASELINE_Y} L ${width} ${AVATAR_BASELINE_Y}`,
    });
  }, [familyMembers, selectedProfileId]);

  useEffect(() => {
    if (!selectedProfileId) return;
    Promise.all([
      api.getFamilyMemberDetail(selectedProfileId),
      api.getAppointments({ familyMemberId: selectedProfileId }),
    ]).then(([detail, appointments]) => {
      setMemberDetail(detail);
      setMemberAppointments(appointments);
    });
  }, [selectedProfileId]);

  if (!selectedProfileId) {
    return <div className="flex-1 flex items-center justify-center text-sm text-gray-500">Cargando...</div>;
  }

  const selectedMember = familyMembers.find((m) => m.id === selectedProfileId) ?? familyMembers[0];

  const nextAppointment =
    memberAppointments
      .filter((a) => UPCOMING_STATUSES.has(a.status))
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())[0] ?? null;

  const startsAtMs = nextAppointment ? new Date(nextAppointment.starts_at).getTime() : null;
  const appointmentEndsAtMs = startsAtMs !== null ? startsAtMs + APPOINTMENT_DURATION_MS : null;
  const isAppointmentPast = appointmentEndsAtMs !== null && Date.now() >= appointmentEndsAtMs;
  const isAppointmentActive = startsAtMs !== null && Date.now() >= startsAtMs && !isAppointmentPast;
  const isAppointmentActiveOrPast = isAppointmentActive || isAppointmentPast;

  const appointmentStatusLabel = !nextAppointment
    ? ''
    : isAppointmentPast
      ? 'Cita finalizada'
      : isAppointmentActive
        ? 'Cita en curso'
        : `Próxima cita en ${daysUntil(nextAppointment.starts_at)} días`;

  const diagnostics = memberDetail?.diagnostics ?? [];
  const medications = memberDetail?.medications ?? [];
  const vitalRanges = memberDetail?.vitalSignRanges ?? [];
  const vitalReadings = memberDetail?.vitalSignReadings ?? [];

  const diagnosticsLabel =
    diagnostics.length === 0 ? 'Sin diagnósticos registrados' : diagnostics.map((d) => d.disease).join(', ');

  const medicationsLabel =
    medications.length === 0 ? 'Sin medicamentos activos' : medications.map((m) => m.name).join(', ');

  const vitalMetricPriority: VitalSignMetric[] = ['blood_pressure', 'heart_rate', 'oxygen_saturation'];
  const latestVitalMetric = vitalMetricPriority.find((metric) => vitalReadings.some((r) => r.metric === metric));
  let vitalsLabel = '';
  if (latestVitalMetric) {
    const readingsForMetric = vitalReadings.filter((r) => r.metric === latestVitalMetric);
    const latestReading = readingsForMetric[readingsForMetric.length - 1];
    const range = vitalRanges.find((r) => r.metric === latestVitalMetric);
    const status =
      range?.min_ideal && range?.max_ideal
        ? vitalStatus(latestReading.value, latestVitalMetric, range.min_ideal, range.max_ideal)
        : 'Normal';
    vitalsLabel = `${status} (${latestReading.value} ${VITAL_METRIC_UNIT[latestVitalMetric]})`;
  }

  const specialties: string[] = [];
  for (const d of diagnostics) {
    if (d.specialist && !specialties.includes(d.specialist)) specialties.push(d.specialist);
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-cyber-lavender/40/90 backdrop-blur-md px-6 pt-12 pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-ultra-indigo font-display tracking-tight">Cuídate</h1>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-ultra-indigo hover:bg-blue-50 transition-colors active:scale-95 shrink-0">
            <Bell size={22} className="fill-primary text-ultra-indigo" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-ultra-indigo hover:bg-blue-50 transition-colors active:scale-95 shrink-0">
            <Settings size={22} className="text-ultra-indigo" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-[100px] pl-0 scrollbar-hide">
        <div className="px-6 flex flex-col gap-8 pt-6 pb-10">
          <section className="flex flex-col gap-3">
            <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 pb-1">
              <div ref={avatarRowRef} className="relative flex items-center gap-5" style={{ height: AVATAR_ROW_HEIGHT }}>
                {avatarConnector && (
                  <svg
                    className="absolute left-0 top-0 pointer-events-none"
                    width={avatarConnector.width}
                    height={AVATAR_ROW_HEIGHT}
                  >
                    <path d={avatarConnector.path} stroke="var(--color-dried-lilac)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                )}
                {familyMembers.map((member) => {
                  const isSelected = member.id === selectedProfileId;
                  const size = isSelected ? SELECTED_AVATAR_SIZE : UNSELECTED_AVATAR_SIZE;
                  return (
                    <button key={member.id} onClick={() => setSelectedProfileId(member.id)} className="relative z-10 shrink-0">
                      <div
                        ref={(el) => {
                          if (el) avatarRefs.current.set(member.id, el);
                        }}
                        style={{ width: size, height: size }}
                        className="rounded-full overflow-hidden"
                      >
                        <img src={member.avatar_url ?? undefined} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                    </button>
                  );
                })}
                <button className="relative z-10 shrink-0">
                  <div
                    style={{ width: UNSELECTED_AVATAR_SIZE, height: UNSELECTED_AVATAR_SIZE }}
                    className="rounded-full border-2 border-dashed border-dried-lilac flex items-center justify-center text-gray-400"
                  >
                    <Plus size={24} />
                  </div>
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-ultra-indigo font-display tracking-tight">
                {selectedMember?.name}
              </h2>
              <p className="text-xs text-gray-500 font-medium">{selectedMember?.relationship}</p>
            </div>
          </section>

          {nextAppointment && (
            <section>
              <div className="bg-prussian text-white rounded-[24px] p-6 relative overflow-hidden shadow-modal group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Heart size={140} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-300" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      {appointmentStatusLabel}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight mb-1 font-display tracking-tight">
                      {formatDateTime(nextAppointment.starts_at)}
                    </h2>
                    <p className="text-sm font-medium text-gray-300">
                      {nextAppointment.specialty} • {nextAppointment.doctor_name}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    {isAppointmentActiveOrPast ? (
                      <>
                        <button
                          onClick={onUploadClick}
                          className="w-full bg-lima text-negro font-semibold text-sm px-6 py-3 rounded-full shadow-float hover:bg-opacity-90 active:bg-opacity-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <Camera size={16} />
                          Cargar órdenes o fórmulas
                        </button>
                        <button className="w-full bg-transparent border-2 border-white/30 text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                          Preparar documentos
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="w-full bg-lima text-negro font-semibold text-sm px-6 py-3 rounded-full shadow-float hover:bg-opacity-90 active:bg-opacity-100 transition-colors">
                          Preparar documentos
                        </button>
                        <button
                          onClick={onUploadClick}
                          className="w-full bg-transparent border-2 border-white/30 text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                          <Camera size={16} />
                          Agregar documentos
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {!nextAppointment && (
            <section className="-mt-2">
              <button
                onClick={onUploadClick}
                className="w-full bg-transparent border-2 border-dashed border-dried-lilac rounded-[24px] p-5 flex items-center justify-between hover:bg-gray-50 hover:border-ultra-indigo transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-negro text-lima flex items-center justify-center group-hover:bg-prussian group-hover:scale-105 transition-all">
                    <Camera size={24} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-base font-semibold text-ultra-indigo font-display tracking-tight">Cargar nuevo documento</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Toma una foto de tus fórmulas</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-ultra-indigo transition-colors" />
              </button>
            </section>
          )}

          <section>
            <h3 className="text-xl font-semibold text-ultra-indigo mb-4 font-display tracking-tight">Información rápida</h3>
            <div className="bg-white rounded-[24px] shadow-float/40 divide-y divide-gray-100">
              <div className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Diagnósticos</p>
                  <p className="text-sm font-semibold text-ultra-indigo mt-0.5">{diagnosticsLabel}</p>
                </div>
              </div>

              <div className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-ultra-indigo shrink-0">
                  <Pill size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Medicamentos</p>
                  <p className="text-sm font-semibold text-ultra-indigo mt-0.5">{medicationsLabel}</p>
                </div>
              </div>

              {latestVitalMetric && (
                <div className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-lime-50 flex items-center justify-center text-lime-700 shrink-0">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Signos vitales (último registro)</p>
                    <p className="text-sm font-semibold text-ultra-indigo mt-0.5">{vitalsLabel}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => onNavigate({ name: 'memberDetail', familyMemberId: selectedProfileId })}
                className="w-full p-4 flex items-center justify-center gap-1 text-sm font-semibold text-ultra-indigo hover:bg-gray-50 transition-colors rounded-b-[24px]"
              >
                Ver detalles
                <ChevronRight size={16} />
              </button>
            </div>
          </section>

          {specialties.length > 0 && (
            <section>
              <h3 className="text-xl font-semibold text-ultra-indigo mb-4 font-display tracking-tight">Historial por especialidad</h3>
              <div className="grid grid-cols-2 gap-3 pb-4">
                {specialties.map((specialist) => {
                  const Icon = SPECIALIST_ICON[specialist] ?? FALLBACK_SPECIALIST_ICON;
                  return (
                    <button
                      key={specialist}
                      className="bg-white rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-float/40 hover:border-ultra-indigo hover:bg-blue-50 transition-colors active:scale-95 group"
                    >
                      <Icon size={28} strokeWidth={1.5} className="text-ultra-indigo mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-semibold text-negro">{specialist}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {!nextAppointment && (
            <section>
              <div className="bg-white border border-dried-lilac rounded-[24px]">
                <EmptyState
                  icon={CalendarDays}
                  title="No tienes citas próximas"
                  description="Cuando agendes una, la verás aquí con acceso directo a sus documentos."
                  className="py-8"
                />
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
