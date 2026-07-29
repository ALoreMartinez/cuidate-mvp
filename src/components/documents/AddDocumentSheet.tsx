import { X, Upload, Camera } from 'lucide-react';

interface Props {
  onClose: () => void;
  onChooseUpload: () => void;
  onChooseCamera: () => void;
}

export function AddDocumentSheet({ onClose, onChooseUpload, onChooseCamera }: Props) {
  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-[375px] bg-white rounded-t-[32px] shadow-modal" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-semibold text-ultra-indigo font-display tracking-tight">Agregar documentos</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-3 pb-8">
          <button
            onClick={onChooseUpload}
            className="flex items-center gap-3 p-4 rounded-[16px] border border-gray-100 hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-ultra-indigo">
              <Upload size={20} />
            </div>
            <span className="text-sm font-semibold text-negro">Cargar documentos</span>
          </button>
          <button
            onClick={onChooseCamera}
            className="flex items-center gap-3 p-4 rounded-[16px] border border-gray-100 hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-cyber-lavender flex items-center justify-center text-ultra-indigo">
              <Camera size={20} />
            </div>
            <span className="text-sm font-semibold text-negro">Tomar foto</span>
          </button>
        </div>
      </div>
    </div>
  );
}
