import { useEffect, useMemo, useState } from 'react';
import { Calendar, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { api, type Appointment, type FamilyMember } from '../api/client';
import { formatDateTime, formatMonthYear } from '../lib/format';
import { SPECIALIST_ICON, FALLBACK_SPECIALIST_ICON } from '../lib/specialistIcons';
import type { View } from '../App';
import { EmptyState } from '../components/EmptyState';

interface Props {
  appointments: Appointment[];
  onNavigate: (view: View) => void;
}

const STATUS_LABEL: Record<Appointment['status'], string> = {
  confirmada: 'Confirmada',
  pendiente: 'Pendiente',
  completada: 'Completada',
  cancelada: 'Cancelada',
};

const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function dateKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function buildMonthWeeks(monthDate: Date): (Date | null)[][] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function CitasView({ appointments, onNavigate }: Props) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    api.getFamilyMembers().then(setFamilyMembers);
  }, []);

  const selfMember = familyMembers.find((m) => m.relationship === 'Mi perfil') ?? null;
  const resolveMemberId = (appt: Appointment) => appt.family_member_id ?? selfMember?.id ?? null;
  const memberForAppointment = (appt: Appointment) => familyMembers.find((m) => m.id === resolveMemberId(appt)) ?? null;

  const filteredByMember = selectedFamilyMemberId
    ? appointments.filter((a) => resolveMemberId(a) === selectedFamilyMemberId)
    : appointments;

  const filteredByCalendarMonth = showCalendar
    ? filteredByMember.filter((a) => {
        const d = new Date(a.starts_at);
        return d.getFullYear() === calendarMonth.getFullYear() && d.getMonth() === calendarMonth.getMonth();
      })
    : filteredByMember;

  const visibleAppointments = selectedDay
    ? filteredByCalendarMonth.filter((a) => dateKey(a.starts_at) === selectedDay)
    : filteredByCalendarMonth;

  const month = visibleAppointments[0] ? formatMonthYear(visibleAppointments[0].starts_at) : null;

  const daysWithAppointments = useMemo(() => {
    const set = new Set<string>();
    filteredByMember.forEach((a) => set.add(dateKey(a.starts_at)));
    return set;
  }, [filteredByMember]);

  const weeks = useMemo(() => buildMonthWeeks(calendarMonth), [calendarMonth]);
  const todayKey = dateKey(new Date().toISOString());

  return (
    <div className="flex flex-col h-full bg-cyber-lavender/40">
      <header className="sticky top-0 z-40 bg-cyber-lavender/40/90 backdrop-blur-md px-6 pt-12 pb-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-ultra-indigo font-display tracking-tight">Citas</h1>
        <button
          onClick={() => setShowCalendar((v) => !v)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
            showCalendar ? 'bg-ultra-indigo text-white' : 'text-ultra-indigo hover:bg-blue-50'
          }`}
        >
          <Calendar size={22} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-[100px] pl-0 scrollbar-hide relative">
        <div className="px-6 py-4 sticky top-0 bg-cyber-lavender/40/90 backdrop-blur-sm z-30 flex flex-col gap-3">
          <div className="flex bg-cyber-lavender/50 rounded-full p-1">
            <button className="flex-1 bg-white text-ultra-indigo font-semibold text-sm py-2 rounded-full shadow-float/50">
              Próximas
            </button>
            <button className="flex-1 text-gray-500 font-semibold text-sm py-2 rounded-full hover:text-negro transition-colors">
              Pasadas
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6">
            <button
              onClick={() => setSelectedFamilyMemberId(null)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                selectedFamilyMemberId === null
                  ? 'bg-ultra-indigo text-white border-ultra-indigo'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              Todos
            </button>
            {familyMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedFamilyMemberId(member.id)}
                className={`shrink-0 flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  selectedFamilyMemberId === member.id
                    ? 'bg-ultra-indigo text-white border-ultra-indigo'
                    : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                <img src={member.avatar_url ?? undefined} alt={member.name} className="w-5 h-5 rounded-full object-cover" />
                {member.name}
              </button>
            ))}
          </div>
        </div>

        {showCalendar && (
          <div className="px-6 pb-4">
            <div className="bg-white rounded-[16px] p-4 shadow-float/40">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft size={18} />
                </button>
                <p className="text-sm font-semibold text-negro">{formatMonthYear(calendarMonth.toISOString())}</p>
                <button
                  onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-gray-400 font-semibold mb-1">
                {WEEKDAY_LABELS.map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {weeks.flat().map((day, i) => {
                  if (!day) return <div key={i} />;
                  const key = dateKey(day.toISOString());
                  const hasAppt = daysWithAppointments.has(key);
                  const isSelected = selectedDay === key;
                  const isToday = key === todayKey;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDay((prev) => (prev === key ? null : key))}
                      className={`aspect-square rounded-[10px] flex items-center justify-center text-sm relative transition-colors ${
                        isSelected
                          ? 'bg-ultra-indigo text-white font-semibold'
                          : isToday
                            ? 'bg-cyber-lavender text-ultra-indigo font-semibold'
                            : 'text-negro hover:bg-gray-50'
                      }`}
                    >
                      {day.getDate()}
                      {hasAppt && !isSelected && <span className="w-1 h-1 rounded-full bg-lima absolute bottom-1.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="px-6 flex flex-col gap-4">
          {!selectedDay && month && (
            <h3 className="text-sm font-semibold text-gray-500 mt-2 uppercase tracking-wider font-display tracking-tight">
              {month}
            </h3>
          )}

          {visibleAppointments.length === 0 && (
            <EmptyState
              icon={CalendarDays}
              title="No tienes citas registradas"
              description="Cuando agendes una cita, aparecerá aquí con todos sus detalles y documentos."
            />
          )}

          {visibleAppointments.map((appt) => {
            const Icon = SPECIALIST_ICON[appt.specialty] ?? FALLBACK_SPECIALIST_ICON;
            const member = memberForAppointment(appt);
            return (
              <div
                key={appt.id}
                onClick={() => onNavigate({ name: 'appointment', appointmentId: appt.id })}
                className="bg-white rounded-[16px] p-5 flex flex-col gap-4 shadow-float/40 hover:border-ultra-indigo transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[16px] bg-blue-50 flex items-center justify-center border border-blue-100 text-ultra-indigo group-hover:bg-ultra-indigo group-hover:text-white transition-colors">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-negro">{appt.specialty}</p>
                      <p className="text-sm text-gray-500 font-medium">{appt.doctor_name}</p>
                    </div>
                  </div>
                  <span className="bg-lima text-negro text-[11px] uppercase tracking-wide font-semibold px-3 py-1 rounded-full">
                    {STATUS_LABEL[appt.status]}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-[12px] border border-gray-100">
                  <CalendarDays size={18} className="text-gray-500" />
                  <span className="text-sm font-semibold text-negro">{formatDateTime(appt.starts_at)}</span>
                </div>

                {member && (
                  <div className="flex items-center gap-1.5 self-start bg-cyber-lavender/40 rounded-full pl-1 pr-3 py-1">
                    <img src={member.avatar_url ?? undefined} alt={member.name} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-xs font-semibold text-ultra-indigo">{member.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
