import { Search, Camera, Download, FlaskConical, BriefcaseMedical, FileText, FolderOpen } from 'lucide-react';
import type { DocumentRecord } from '../api/client';
import { CATEGORY_LABELS } from '../lib/format';
import { EmptyState } from '../components/EmptyState';

interface Props {
  documents: DocumentRecord[];
  activeCategory: 'todos' | 'formula' | 'analisis' | 'imagen';
  onCategoryChange: (category: 'todos' | 'formula' | 'analisis' | 'imagen') => void;
  onUploadClick: () => void;
  onDownload: (documentId: string) => void;
}

const FILTERS: Array<{ key: Props['activeCategory']; label: string }> = [
  { key: 'todos', label: 'Todos' },
  { key: 'formula', label: 'Fórmulas' },
  { key: 'analisis', label: 'Análisis' },
  { key: 'imagen', label: 'Imágenes' },
];

function iconForCategory(category: DocumentRecord['category']) {
  if (category === 'analisis') return FlaskConical;
  if (category === 'formula') return BriefcaseMedical;
  return FileText;
}

export function DocumentsView({ documents, activeCategory, onCategoryChange, onUploadClick, onDownload }: Props) {
  return (
    <div className="flex flex-col h-full bg-cyber-lavender/40">
      <header className="sticky top-0 z-40 bg-cyber-lavender/40/90 backdrop-blur-md px-6 pt-12 pb-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-ultra-indigo font-display tracking-tight">Documentos</h1>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-ultra-indigo hover:bg-blue-50 transition-colors active:scale-95">
          <Search size={22} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-[100px] pl-0 scrollbar-hide relative">
        <div className="px-6 py-0 sticky top-0 bg-cyber-lavender/40/90 backdrop-blur-sm z-30">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-6 pt-4 -mx-6 px-6">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => onCategoryChange(f.key)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap active:scale-95 transition-transform ${
                  activeCategory === f.key
                    ? 'bg-ultra-indigo text-white shadow-float/40'
                    : 'bg-white text-gray-600 shadow-float/40 hover:border-ultra-indigo hover:text-ultra-indigo'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 flex flex-col gap-3">
          {documents.length === 0 && (
            <EmptyState
              icon={FolderOpen}
              title={activeCategory === 'todos' ? 'Aún no tienes documentos' : `Sin documentos en "${CATEGORY_LABELS[activeCategory]}"`}
              description={
                activeCategory === 'todos'
                  ? 'Sube tus fórmulas, análisis o imágenes para tenerlos siempre a la mano.'
                  : 'Prueba con otra categoría o sube un documento nuevo.'
              }
              actionLabel="Cargar documento"
              onAction={onUploadClick}
            />
          )}
          {documents.map((doc) => {
            const Icon = iconForCategory(doc.category);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-[16px] p-4 flex items-start gap-4 shadow-float/40 relative overflow-hidden group hover:border-ultra-indigo transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-[12px] bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                  <Icon size={22} className="text-ultra-indigo" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-negro">{doc.title}</p>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    {doc.provider_label || 'Sin proveedor'} {doc.doc_date ? `• ${doc.doc_date}` : ''}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-cyber-lavender text-ultra-indigo text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                      {CATEGORY_LABELS[doc.category ?? 'otro']}
                    </span>
                    {doc.status === 'pending_review' && (
                      <span className="bg-skill-green/20 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                        Nuevo
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDownload(doc.id)}
                  className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                >
                  <Download size={20} className="text-gray-400 hover:text-ultra-indigo" />
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={onUploadClick}
          className="absolute bottom-6 right-6 w-14 h-14 bg-lima text-negro rounded-full flex items-center justify-center shadow-float border-none transition-transform hover:scale-105 active:scale-95 transition-all z-40"
        >
          <Camera size={26} />
        </button>
      </main>
    </div>
  );
}
