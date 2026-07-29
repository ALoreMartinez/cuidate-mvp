import { useState } from 'react';
import { X, FileText, Printer, Inbox } from 'lucide-react';
import { api, type DocumentRecord } from '../../api/client';
import { CATEGORY_LABELS } from '../../lib/format';
import { EmptyState } from '../EmptyState';

interface Props {
  appointmentId: string;
  allDocuments: DocumentRecord[];
  preselectedIds: string[];
  onClose: () => void;
  onPackageCreated: (pkg: { id: string; downloadUrl: string }) => void;
}

export function PreparePackageSheet({ appointmentId, allDocuments, preselectedIds, onClose, onPackageCreated }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(preselectedIds));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleGenerate = async () => {
    if (selected.size === 0) {
      setError('Selecciona al menos un documento.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const pkg = await api.createPackage(appointmentId, Array.from(selected));
      onPackageCreated(pkg);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo generar el paquete.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-[375px] bg-white rounded-t-[32px] max-h-[85vh] flex flex-col shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-semibold text-ultra-indigo font-display tracking-tight">Preparar documentos</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2 scrollbar-hide">
          {allDocuments.length === 0 && (
            <EmptyState
              icon={Inbox}
              title="Tu librería está vacía"
              description="Sube un documento desde la pantalla de Documentos para poder incluirlo en el paquete."
            />
          )}
          {allDocuments.map((doc) => (
            <label
              key={doc.id}
              className="flex items-center gap-3 p-3 rounded-[16px] border border-gray-100 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.has(doc.id)}
                onChange={() => toggle(doc.id)}
                className="w-5 h-5 accent-ultra-indigo shrink-0"
              />
              <FileText size={18} className="text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-negro truncate">{doc.title}</p>
                <p className="text-xs text-gray-500">
                  {doc.provider_label || CATEGORY_LABELS[doc.category ?? 'otro']}
                </p>
              </div>
            </label>
          ))}
        </div>

        {error && <p className="px-6 text-xs text-red-500 -mt-2 mb-2">{error}</p>}

        <div className="px-6 pb-8 pt-2 border-t border-gray-100">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-lima text-negro font-semibold text-sm py-3.5 rounded-full shadow-float flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] transition-all"
          >
            <Printer size={18} />
            {loading ? 'Generando...' : `Generar paquete (${selected.size})`}
          </button>
        </div>
      </div>
    </div>
  );
}
