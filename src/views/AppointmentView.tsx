import { useEffect, useState } from 'react';
import {
  ArrowLeft, Clock, Info, MapPin, Utensils, FileText, Folder, Download,
  BriefcaseMedical, FlaskConical, Printer,
} from 'lucide-react';
import { api, type Appointment, type DocumentRecord } from '../api/client';
import { formatDateTime } from '../lib/format';
import { PreparePackageSheet } from '../components/print/PreparePackageSheet';
import { SendChannelSheet } from '../components/print/SendChannelSheet';
import { EmptyState } from '../components/EmptyState';

interface Props {
  appointmentId: string;
  onBack: () => void;
  onDownload: (documentId: string) => void;
}

const STATUS_LABEL: Record<Appointment['status'], string> = {
  confirmada: 'Confirmada',
  pendiente: 'Pendiente',
  completada: 'Completada',
  cancelada: 'Cancelada',
};

export function AppointmentView({ appointmentId, onBack, onDownload }: Props) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [libraryDocuments, setLibraryDocuments] = useState<DocumentRecord[]>([]);
  const [showPrepareSheet, setShowPrepareSheet] = useState(false);
  const [createdPackage, setCreatedPackage] = useState<{ id: string; downloadUrl: string } | null>(null);

  useEffect(() => {
    api.getAppointment(appointmentId).then(setAppointment);
    api.getDocuments({ status: 'confirmed' }).then(setLibraryDocuments);
  }, [appointmentId]);

  if (!appointment) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-500">Cargando cita...</div>
    );
  }

  const linkedDocs = appointment.documents ?? [];
  // La librería del selector debe incluir tanto los confirmados como los que ya están
  // vinculados a esta cita (aunque sigan pending_review) — si no, el conteo de
  // seleccionados no coincide con lo que el usuario ve marcado.
  const pickerDocuments = [
    ...linkedDocs,
    ...libraryDocuments.filter((doc) => !linkedDocs.some((linked) => linked.id === doc.id)),
  ];

  return (
    <div className="flex flex-col h-full bg-surface-dim">
      <header className="sticky top-0 z-40 bg-cyber-lavender/40/90 backdrop-blur-md px-4 pt-12 pb-4 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-blue-50 active:scale-95 transition-all">
          <ArrowLeft size={24} className="text-ultra-indigo" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-ultra-indigo mr-8 font-display tracking-tight">
          Detalles de la cita
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-8 scrollbar-hide px-4 pt-4 flex flex-col gap-4 bg-cyber-lavender/40">
        <div className="bg-prussian rounded-[16px] p-5 text-white flex flex-col gap-4 shadow-float">
          <div className="flex justify-between items-center">
            <span className="bg-lima text-negro text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full">
              {STATUS_LABEL[appointment.status]}
            </span>
            <div className="flex items-center gap-1.5 text-gray-300 text-sm font-medium">
              <Clock size={16} />
              <span>{formatDateTime(appointment.starts_at)}</span>
            </div>
          </div>
          <div className="mt-1">
            <h2 className="text-3xl font-semibold tracking-tight mb-2 font-display tracking-tight">{appointment.specialty}</h2>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <BriefcaseMedical size={18} />
              <span className="font-medium text-base">{appointment.doctor_name}</span>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="flex-1 border border-dried-lilac text-white rounded-full py-3 font-semibold text-sm hover:bg-white/10 active:scale-[0.98] transition-all">
              Reprogramar
            </button>
            <button className="flex-[1.2] bg-lima text-negro rounded-full py-3 font-semibold text-sm shadow-float hover:opacity-90 active:scale-[0.98] transition-all">
              Iniciar Consulta
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowPrepareSheet(true)}
          className="w-full bg-ultra-indigo text-white rounded-[16px] py-4 px-5 flex items-center justify-between shadow-float hover:opacity-95 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Printer size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Preparar documentos para la cita</p>
              <p className="text-xs text-white/70">Arma el paquete y envíalo a imprimir</p>
            </div>
          </div>
        </button>

        {appointment.location_name && (
          <div className="border border-gray-200 rounded-[16px] bg-white p-5 flex flex-col gap-5 shadow-float/40">
            <h3 className="flex items-center gap-2 font-semibold text-negro text-base font-display tracking-tight">
              <Info size={20} />
              Información General
            </h3>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 font-display tracking-tight">Ubicación</h4>
              <div className="flex items-start gap-3 mb-4">
                <MapPin size={22} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-negro text-[15px]">{appointment.location_name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{appointment.location_address}</p>
                </div>
              </div>
            </div>
            {appointment.instructions.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 font-display tracking-tight">Instrucciones Previas</h4>
                <div className="flex flex-col gap-2.5">
                  {appointment.instructions.map((instruction, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                      <Utensils size={20} className="text-gray-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 leading-snug">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 mt-2">
          <h3 className="flex items-center gap-2 font-semibold text-negro text-base px-1 font-display tracking-tight">
            <Folder size={20} />
            Documentos Relacionados
          </h3>

          {linkedDocs.length === 0 && (
            <div className="bg-white rounded-[16px] shadow-float/40">
              <EmptyState
                icon={Folder}
                title="Sin documentos vinculados"
                description="Usa «Preparar documentos para la cita» para añadir los que necesites."
                actionLabel="Preparar documentos"
                onAction={() => setShowPrepareSheet(true)}
                className="py-8"
              />
            </div>
          )}

          {linkedDocs.map((doc) => (
            <div key={doc.id} className="bg-white rounded-[16px] p-3.5 flex items-center gap-4 shadow-float/40">
              <div className="w-12 h-12 rounded-[12px] bg-gray-100/80 flex items-center justify-center shrink-0 border border-gray-200/50">
                {doc.category === 'analisis' ? (
                  <FlaskConical size={22} className="text-gray-600" strokeWidth={1.5} />
                ) : (
                  <FileText size={22} className="text-gray-600" strokeWidth={1.5} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-negro">{doc.title}</p>
                <p className="text-[13px] text-gray-500 mt-0.5">{doc.provider_label || 'Documento'}</p>
              </div>
              <button
                onClick={() => onDownload(doc.id)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
              >
                <Download size={20} className="text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      </main>

      {showPrepareSheet && (
        <PreparePackageSheet
          appointmentId={appointment.id}
          allDocuments={pickerDocuments}
          preselectedIds={linkedDocs.map((d) => d.id)}
          onClose={() => setShowPrepareSheet(false)}
          onPackageCreated={(pkg) => {
            setShowPrepareSheet(false);
            setCreatedPackage(pkg);
          }}
        />
      )}

      {createdPackage && (
        <SendChannelSheet
          packageId={createdPackage.id}
          downloadUrl={createdPackage.downloadUrl}
          onClose={() => setCreatedPackage(null)}
        />
      )}
    </div>
  );
}
