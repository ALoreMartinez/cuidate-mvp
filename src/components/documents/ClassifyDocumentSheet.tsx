import { useState } from 'react';
import { Check } from 'lucide-react';
import { api, type DocumentRecord } from '../../api/client';
import { CATEGORY_LABELS } from '../../lib/format';

interface Props {
  document: DocumentRecord;
  onDone: () => void;
}

const CATEGORIES: Array<DocumentRecord['category']> = ['formula', 'analisis', 'imagen', 'otro'];

export function ClassifyDocumentSheet({ document, onDone }: Props) {
  const [category, setCategory] = useState<DocumentRecord['category']>('otro');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patchDocument(document.id, { category: category ?? 'otro', status: 'confirmed' });
    } finally {
      setSaving(false);
      onDone();
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40">
      <div className="w-full max-w-[375px] bg-white rounded-t-[32px] shadow-modal px-6 pt-6 pb-8">
        <h2 className="text-lg font-semibold text-ultra-indigo font-display tracking-tight mb-1">Clasificar documento</h2>
        <p className="text-sm text-gray-500 mb-5 truncate">{document.title}</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`p-4 rounded-[16px] text-sm font-semibold border transition-colors ${
                category === cat
                  ? 'bg-ultra-indigo text-white border-ultra-indigo'
                  : 'bg-white text-negro border-gray-200 hover:border-ultra-indigo'
              }`}
            >
              {CATEGORY_LABELS[cat ?? 'otro']}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-lima text-negro font-semibold text-sm py-3.5 rounded-full shadow-float flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] transition-all"
        >
          <Check size={18} />
          {saving ? 'Guardando...' : 'Guardar y confirmar'}
        </button>
      </div>
    </div>
  );
}
