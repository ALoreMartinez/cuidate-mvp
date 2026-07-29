/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Users, FileText, CalendarDays } from 'lucide-react';
import { api, type Appointment, type DocumentRecord } from './api/client';
import { HomeView } from './views/HomeView';
import { DocumentsView } from './views/DocumentsView';
import { CitasView } from './views/CitasView';
import { AppointmentView } from './views/AppointmentView';
import { ClassifyDocumentSheet } from './components/documents/ClassifyDocumentSheet';
import { AddDocumentSheet } from './components/documents/AddDocumentSheet';
import { FamilyMemberDetailView } from './views/FamilyMemberDetailView';

export type View =
  | { name: 'home' }
  | { name: 'documents' }
  | { name: 'citas' }
  | { name: 'appointment'; appointmentId: string }
  | { name: 'memberDetail'; familyMemberId: string };

export default function App() {
  const [view, setView] = useState<View>({ name: 'home' });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [activeCategory, setActiveCategory] = useState<'todos' | 'formula' | 'analisis' | 'imagen'>('todos');
  const [documentToClassify, setDocumentToClassify] = useState<DocumentRecord | null>(null);
  const [showAddDocumentSheet, setShowAddDocumentSheet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const refreshAppointments = () => api.getAppointments().then(setAppointments);

  useEffect(() => {
    refreshAppointments();
  }, []);

  useEffect(() => {
    if (view.name !== 'documents') return;
    api.getDocuments(activeCategory === 'todos' ? undefined : { category: activeCategory }).then(setDocuments);
  }, [view, activeCategory]);

  const handleUploadClick = () => setShowAddDocumentSheet(true);
  const handleChooseUpload = () => {
    setShowAddDocumentSheet(false);
    fileInputRef.current?.click();
  };
  const handleChooseCamera = () => {
    setShowAddDocumentSheet(false);
    cameraInputRef.current?.click();
  };

  const handleFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const doc = await api.uploadDocument(file);
    setDocumentToClassify(doc);
  };

  const handleClassifyDone = () => {
    setDocumentToClassify(null);
    if (view.name === 'documents') {
      api.getDocuments(activeCategory === 'todos' ? undefined : { category: activeCategory }).then(setDocuments);
    }
  };

  const handleDownload = async (documentId: string) => {
    const { downloadUrl } = await api.getDocumentDownloadUrl(documentId);
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-body">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        hidden
        onChange={handleFileSelected}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFileSelected}
      />

      <div className="w-full max-w-[375px] bg-cyber-lavender/40 relative overflow-hidden shadow-2xl flex flex-col h-[100dvh]">
        {view.name === 'home' && <HomeView onNavigate={setView} onUploadClick={handleUploadClick} />}

        {view.name === 'documents' && (
          <DocumentsView
            documents={documents}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onUploadClick={handleUploadClick}
            onDownload={handleDownload}
          />
        )}

        {view.name === 'appointment' && (
          <AppointmentView appointmentId={view.appointmentId} onBack={() => setView({ name: 'home' })} onDownload={handleDownload} />
        )}

        {view.name === 'citas' && <CitasView appointments={appointments} onNavigate={setView} />}

        {view.name === 'memberDetail' && (
          <FamilyMemberDetailView familyMemberId={view.familyMemberId} onBack={() => setView({ name: 'home' })} />
        )}

        {view.name !== 'appointment' && view.name !== 'memberDetail' && (
          <nav className="absolute bottom-0 w-full bg-white flex justify-around items-center px-4 py-3 pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-50 rounded-t-[32px]">
            <button
              onClick={() => setView({ name: 'documents' })}
              className={`flex flex-col items-center justify-center gap-1 w-16 py-2 rounded-[24px] transition-all ${view.name === 'documents' ? 'bg-ultra-indigo text-white shadow-float shadow-ultra-indigo/20' : 'text-gray-400 hover:text-ultra-indigo'}`}
            >
              <FileText size={22} className={view.name === 'documents' ? 'fill-current' : ''} />
              <span className="text-[11px] font-semibold">Documentos</span>
            </button>

            <button
              onClick={() => setView({ name: 'home' })}
              className={`flex flex-col items-center justify-center gap-1 w-16 py-2 rounded-[24px] transition-all ${view.name === 'home' ? 'bg-ultra-indigo text-white shadow-float shadow-ultra-indigo/20' : 'text-gray-400 hover:text-ultra-indigo'}`}
            >
              <Users size={22} className={view.name === 'home' ? 'fill-current' : ''} />
              <span className="text-[11px] font-semibold">Mi grupo</span>
            </button>

            <button
              onClick={() => setView({ name: 'citas' })}
              className={`flex flex-col items-center justify-center gap-1 w-16 py-2 rounded-[24px] transition-all ${view.name === 'citas' ? 'bg-ultra-indigo text-white shadow-float shadow-ultra-indigo/20' : 'text-gray-400 hover:text-ultra-indigo'}`}
            >
              <CalendarDays size={22} className={view.name === 'citas' ? 'fill-current' : ''} />
              <span className="text-[11px] font-semibold">Calendario</span>
            </button>
          </nav>
        )}
      </div>

      {documentToClassify && <ClassifyDocumentSheet document={documentToClassify} onDone={handleClassifyDone} />}
      {showAddDocumentSheet && (
        <AddDocumentSheet
          onClose={() => setShowAddDocumentSheet(false)}
          onChooseUpload={handleChooseUpload}
          onChooseCamera={handleChooseCamera}
        />
      )}
    </div>
  );
}
