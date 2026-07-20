/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  ChevronRight, 
  Camera, 
  Pill, 
  Stethoscope, 
  ClipboardList, 
  Heart, 
  Sparkles, 
  Baby, 
  UserCircle,
  Home,
  FileText,
  CalendarDays,
  ArrowLeft,
  Clock,
  Info,
  MapPin,
  Utensils,
  Folder,
  Download,
  FlaskConical,
  History,
  BriefcaseMedical,
  Search
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'appointment' | 'documents' | 'citas'>('home');

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-body">
      {/* Mobile Screen Container */}
      <div className="w-full max-w-[375px] bg-cyber-lavender/40 relative overflow-hidden shadow-2xl flex flex-col h-[100dvh]">
        
        {currentView === 'home' && (
          <>
            {/* Fixed Header */}
            <header className="sticky top-0 z-40 bg-cyber-lavender/40/90 backdrop-blur-md px-6 pt-12 pb-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-ultra-indigo leading-tight tracking-tight font-display tracking-tight">Hola, Usuario</h1>
                  <p className="text-xs text-gray-500 font-medium">¡Bienvenido de vuelta!</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-ultra-indigo hover:bg-blue-50 transition-colors active:scale-95 shrink-0">
                <Bell size={22} className="fill-primary text-ultra-indigo" />
              </button>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto pb-[100px] pl-0 scrollbar-hide">
              <div className="px-6 flex flex-col gap-8 pt-6 pb-10">
                
                {/* Featured Card: Próxima cita */}
                <section>
                  <div 
                    onClick={() => setCurrentView('appointment')}
                    className="bg-prussian text-white rounded-[24px] p-6 relative overflow-hidden shadow-modal active:scale-[0.98] transition-transform cursor-pointer group"
                  >
                    <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                      <Heart size={140} strokeWidth={1} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-300" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                          Próxima cita en 3 días
                        </span>
                      </div>
                      
                      <div>
                        <h2 className="text-3xl font-semibold tracking-tight mb-1 font-display tracking-tight">15 Oct, 10:00 AM</h2>
                        <p className="text-sm font-medium text-gray-300">
                          Cardiología • Dra. Elena Rivas
                        </p>
                      </div>
                      
                      <button className="mt-2 bg-lima text-negro font-semibold text-sm px-6 py-3 rounded-full w-fit shadow-float hover:bg-opacity-90 active:bg-opacity-100 transition-colors">
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </section>

                {/* Cargar nuevo documento FAB style */}
                <section className="-mt-2">
                  <button className="w-full bg-transparent border-2 border-dashed border-dried-lilac rounded-[24px] p-5 flex items-center justify-between hover:bg-gray-50 hover:border-ultra-indigo transition-all active:scale-[0.98] group">
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

            {/* Información rápida */}
            <section>
              <h3 className="text-xl font-semibold text-ultra-indigo mb-0 font-display tracking-tight">Información rápida</h3>
              {/* Horizontal Scroll Container */}
              <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-6 px-6 pt-4 pb-8">
                
                <div className="w-[150px] shrink-0 bg-white rounded-[24px] p-4 shadow-float/40 hover:shadow-float hover:-translate-y-1 transition-all active:scale-95 cursor-pointer flex flex-col gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-ultra-indigo group-hover:bg-ultra-indigo group-hover:text-white transition-colors">
                    <Pill size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ultra-indigo">Medicamentos</p>
                    <p className="text-xs text-gray-500 mt-0.5">3 activos</p>
                  </div>
                </div>

                <div className="w-[150px] shrink-0 bg-white rounded-[24px] p-4 shadow-float/40 hover:shadow-float hover:-translate-y-1 transition-all active:scale-95 cursor-pointer flex flex-col gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-ultra-indigo group-hover:bg-ultra-indigo group-hover:text-white transition-colors">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ultra-indigo">Especialidades</p>
                    <p className="text-xs text-gray-500 mt-0.5">Cardiología, Derma</p>
                  </div>
                </div>

                <div className="w-[150px] shrink-0 bg-white rounded-[24px] p-4 shadow-float/40 hover:shadow-float hover:-translate-y-1 transition-all active:scale-95 cursor-pointer flex flex-col gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ultra-indigo">Docs. pendientes</p>
                    <p className="text-xs text-red-500 mt-0.5 font-medium">2 por revisar</p>
                  </div>
                </div>

              </div>
            </section>

            {/* Historial por especialidad */}
            <section>
              <h3 className="text-xl font-semibold text-ultra-indigo mb-4 font-display tracking-tight">Historial por especialidad</h3>
              <div className="grid grid-cols-2 gap-3 pb-4">
                
                <button className="bg-white rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-float/40 hover:border-ultra-indigo hover:bg-blue-50 transition-colors active:scale-95 group">
                  <Heart size={28} strokeWidth={1.5} className="text-ultra-indigo mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-negro">Cardiología</span>
                </button>
                
                <button className="bg-white rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-float/40 hover:border-ultra-indigo hover:bg-blue-50 transition-colors active:scale-95 group">
                  <Sparkles size={28} strokeWidth={1.5} className="text-ultra-indigo mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-negro">Dermatología</span>
                </button>
                
                <button className="bg-white rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-float/40 hover:border-ultra-indigo hover:bg-blue-50 transition-colors active:scale-95 group">
                  <Baby size={28} strokeWidth={1.5} className="text-ultra-indigo mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-negro">Pediatría</span>
                </button>
                
                <button className="bg-white rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-float/40 hover:border-ultra-indigo hover:bg-blue-50 transition-colors active:scale-95 group">
                  <UserCircle size={28} strokeWidth={1.5} className="text-ultra-indigo mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-negro">Ginecología</span>
                </button>

              </div>
            </section>

          </div>
        </main>
          </>
        )}

      {currentView === 'documents' && (
        <div className="flex flex-col h-full bg-cyber-lavender/40">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-cyber-lavender/40/90 backdrop-blur-md px-6 pt-12 pb-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-ultra-indigo font-display tracking-tight">Documentos</h1>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-ultra-indigo hover:bg-blue-50 transition-colors active:scale-95">
              <Search size={22} />
            </button>
          </header>
          
          <main className="flex-1 overflow-y-auto pb-[100px] pl-0 scrollbar-hide relative">
            {/* Categorías / Filtros */}
            <div className="px-6 py-0 sticky top-0 bg-cyber-lavender/40/90 backdrop-blur-sm z-30">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-6 pt-4 -mx-6 px-6">
                <button className="shrink-0 bg-ultra-indigo text-white px-4 py-1.5 rounded-full shadow-float/40 text-sm font-semibold whitespace-nowrap active:scale-95 transition-transform">Todos</button>
                <button className="shrink-0 bg-white text-gray-600 shadow-float/40 px-4 py-1.5 rounded-full text-sm font-semibold hover:border-ultra-indigo hover:text-ultra-indigo transition-colors whitespace-nowrap active:scale-95">Fórmulas</button>
                <button className="shrink-0 bg-white text-gray-600 shadow-float/40 px-4 py-1.5 rounded-full text-sm font-semibold hover:border-ultra-indigo hover:text-ultra-indigo transition-colors whitespace-nowrap active:scale-95">Análisis</button>
                <button className="shrink-0 bg-white text-gray-600 shadow-float/40 px-4 py-1.5 rounded-full text-sm font-semibold hover:border-ultra-indigo hover:text-ultra-indigo transition-colors whitespace-nowrap active:scale-95">Imágenes</button>
              </div>
            </div>
            
            {/* Lista de Documentos */}
            <div className="px-6 flex flex-col gap-3">
               <div className="bg-white rounded-[16px] p-4 flex items-start gap-4 shadow-float/40 relative overflow-hidden group hover:border-ultra-indigo transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-[12px] bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                     <FlaskConical size={22} className="text-ultra-indigo" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                     <p className="text-[15px] font-semibold text-negro">Análisis de sangre completo</p>
                     <p className="text-[13px] text-gray-500 mt-0.5">Laboratorio Central • 12 Oct</p>
                     <div className="flex gap-2 mt-2">
                        <span className="bg-cyber-lavender text-ultra-indigo text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">Análisis</span>
                        <span className="bg-skill-green/20 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">Nuevo</span>
                     </div>
                  </div>
                  <button className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
                     <Download size={20} className="text-gray-400 hover:text-ultra-indigo" />
                  </button>
               </div>
               
               <div className="bg-white rounded-[16px] p-4 flex items-start gap-4 shadow-float/40 relative overflow-hidden group hover:border-ultra-indigo transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-[12px] bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                     <BriefcaseMedical size={22} className="text-gray-600" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                     <p className="text-[15px] font-semibold text-negro">Orden médica Cardiología</p>
                     <p className="text-[13px] text-gray-500 mt-0.5">Dra. Elena Rivas • 10 Oct</p>
                     <div className="flex gap-2 mt-2">
                        <span className="bg-cyber-lavender text-ultra-indigo text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">Fórmulas</span>
                     </div>
                  </div>
                  <button className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
                     <Download size={20} className="text-gray-400 hover:text-ultra-indigo" />
                  </button>
               </div>
               
               <div className="bg-white rounded-[16px] p-4 flex items-start gap-4 shadow-float/40 relative overflow-hidden group hover:border-ultra-indigo transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-[12px] bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                     <FileText size={22} className="text-gray-600" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                     <p className="text-[15px] font-semibold text-negro">Radiografía de Tórax</p>
                     <p className="text-[13px] text-gray-500 mt-0.5">Centro Radiológico • 05 Sep</p>
                     <div className="flex gap-2 mt-2">
                        <span className="bg-cyber-lavender text-ultra-indigo text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">Imágenes</span>
                     </div>
                  </div>
                  <button className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
                     <Download size={20} className="text-gray-400 hover:text-ultra-indigo" />
                  </button>
               </div>
            </div>
            
            {/* FAB */}
            <button className="absolute bottom-6 right-6 w-14 h-14 bg-lima text-negro rounded-full flex items-center justify-center shadow-float border-none transition-transform hover:scale-105 active:scale-95 transition-all z-40 ">
               <Camera size={26} />
            </button>
          </main>
        </div>
      )}

      {currentView === 'appointment' && (
        <div className="flex flex-col h-full bg-surface-dim">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-cyber-lavender/40/90 backdrop-blur-md px-4 pt-12 pb-4 flex items-center">
              <button 
                onClick={() => setCurrentView('home')} 
                className="p-2 -ml-2 rounded-full hover:bg-blue-50 active:scale-95 transition-all"
              >
                <ArrowLeft size={24} className="text-ultra-indigo" />
              </button>
              <h1 className="flex-1 text-center text-lg font-semibold text-ultra-indigo mr-8 font-display tracking-tight">Detalles de la cita</h1>
            </header>
            
            <main className="flex-1 overflow-y-auto pb-8 scrollbar-hide px-4 pt-4 flex flex-col gap-4 bg-cyber-lavender/40">
              
              {/* Top Card */}
              <div className="bg-prussian rounded-[16px] p-5 text-white flex flex-col gap-4 shadow-float">
                 <div className="flex justify-between items-center">
                   <span className="bg-lima text-negro text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full">Confirmada</span>
                   <div className="flex items-center gap-1.5 text-gray-300 text-sm font-medium">
                      <Clock size={16} />
                      <span>15 Oct, 10:00 AM</span>
                   </div>
                 </div>
                 
                 <div className="mt-1">
                   <h2 className="text-3xl font-semibold tracking-tight mb-2 font-display tracking-tight">Cardiología</h2>
                   <div className="flex items-center gap-2 text-gray-300 text-sm">
                     <Stethoscope size={18} />
                     <span className="font-medium text-base">Dra. Elena Rivas</span>
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

              {/* Información General */}
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
                        <p className="font-semibold text-negro text-[15px]">Centro Médico Central</p>
                        <p className="text-sm text-gray-500 mt-0.5">Consultorio 402, Piso 4<br/>Av. Principal 123, Ciudad</p>
                     </div>
                   </div>
                   
                   <div className="w-full h-36 bg-gray-200 rounded-[16px] overflow-hidden relative border border-gray-200">
                      <img 
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400" 
                        alt="Map" 
                        className="w-full h-full object-cover opacity-80" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center shadow-modal border-2 border-white">
                           <MapPin size={20} className="text-white fill-current" />
                         </div>
                      </div>
                   </div>
                 </div>

                 <div className="mt-2">
                   <h4 className="text-sm font-semibold text-gray-700 mb-3 font-display tracking-tight">Instrucciones Previas</h4>
                   <div className="flex flex-col gap-2.5">
                      <div className="flex items-start gap-3 bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                         <Utensils size={20} className="text-gray-500 shrink-0 mt-0.5" />
                         <p className="text-sm text-gray-700 leading-snug">Ayuno de 8 horas requerido antes de la cita.</p>
                      </div>
                      <div className="flex items-start gap-3 bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                         <FileText size={20} className="text-gray-500 shrink-0 mt-0.5" />
                         <p className="text-sm text-gray-700 leading-snug">Traer estudios previos de laboratorio y ecocardiograma.</p>
                      </div>
                   </div>
                 </div>
              </div>

              {/* Documentos Relacionados */}
              <div className="flex flex-col gap-3 mt-2">
                 <h3 className="flex items-center gap-2 font-semibold text-negro text-base px-1 font-display tracking-tight">
                    <Folder size={20} />
                    Documentos Relacionados
                 </h3>
                 
                 <div className="bg-white rounded-[16px] p-3.5 flex items-center gap-4 shadow-float/40">
                    <div className="w-12 h-12 rounded-[12px] bg-gray-100/80 flex items-center justify-center shrink-0 border border-gray-200/50">
                       <BriefcaseMedical size={22} className="text-gray-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                       <p className="text-[15px] font-semibold text-negro">Orden médica</p>
                       <p className="text-[13px] text-gray-500 mt-0.5">PDF • Emitido 10 Oct</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
                      <Download size={20} className="text-gray-600" />
                    </button>
                 </div>
                 
                 <div className="bg-white rounded-[16px] p-3.5 flex items-center gap-4 shadow-float/40">
                    <div className="w-12 h-12 rounded-[12px] bg-gray-100/80 flex items-center justify-center shrink-0 border border-gray-200/50">
                       <FlaskConical size={22} className="text-gray-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                       <p className="text-[15px] font-semibold text-negro">Análisis de sangre</p>
                       <p className="text-[13px] text-gray-500 mt-0.5">PDF • Resultados 12 Oct</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
                      <Download size={20} className="text-gray-600" />
                    </button>
                 </div>
              </div>

              {/* Historial de Cardiología */}
              <div className="border border-gray-200 rounded-[16px] bg-white p-5 flex flex-col gap-5 mt-2 mb-6 shadow-float/40">
                 <h3 className="flex items-center gap-2 font-semibold text-negro text-base font-display tracking-tight">
                    <History size={20} />
                    Historial de Cardiología
                 </h3>
                 
                 <div className="relative pl-4 mt-2 border-l-2 border-gray-200 flex flex-col gap-8 ml-2">
                    
                    {/* Timeline Item 1 */}
                    <div className="relative">
                      <div className="absolute w-3.5 h-3.5 bg-emerald-400 rounded-full -left-[25px] top-0.5 border-[3px] border-white shadow-float/40"></div>
                      <p className="text-[13px] font-semibold text-emerald-500 mb-2.5 -mt-1">10 Ago, 2023</p>
                      
                      <div className="bg-gray-50/80 border border-gray-100 rounded-[16px] p-3.5 shadow-float/40">
                         <p className="text-[15px] font-semibold text-negro">Consulta de Seguimiento</p>
                         <p className="text-[13px] text-gray-500 mb-2 font-medium">Dra. Elena Rivas</p>
                         <p className="text-sm text-gray-600 leading-snug">Presión arterial estable. Se ajustó dosis de medicación. Próxima revisión en 2 meses.</p>
                      </div>
                    </div>

                    {/* Timeline Item 2 */}
                    <div className="relative">
                      <div className="absolute w-3.5 h-3.5 bg-gray-300 rounded-full -left-[25px] top-0.5 border-[3px] border-white shadow-float/40"></div>
                      <p className="text-[13px] font-semibold text-gray-600 mb-2.5 -mt-1">15 Mar, 2023</p>
                      
                      <div className="bg-gray-50/80 border border-gray-100 rounded-[16px] p-3.5 shadow-float/40">
                         <p className="text-[15px] font-semibold text-negro">Primera Consulta</p>
                         <p className="text-[13px] text-gray-500 mb-2 font-medium">Dra. Elena Rivas</p>
                         <p className="text-sm text-gray-600 leading-snug">Evaluación inicial por taquicardia. Se solicitó Holter 24h y ecocardiograma.</p>
                      </div>
                    </div>
                 </div>
              </div>

            </main>
          </div>
        )}

      {currentView === 'citas' && (
        <div className="flex flex-col h-full bg-cyber-lavender/40">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-cyber-lavender/40/90 backdrop-blur-md px-6 pt-12 pb-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-ultra-indigo font-display tracking-tight">Citas</h1>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-ultra-indigo hover:bg-blue-50 transition-colors active:scale-95">
              <Calendar size={22} />
            </button>
          </header>
          
          <main className="flex-1 overflow-y-auto pb-[100px] pl-0 scrollbar-hide relative">
            {/* Tabs */}
            <div className="px-6 py-4 sticky top-0 bg-cyber-lavender/40/90 backdrop-blur-sm z-30">
              <div className="flex bg-cyber-lavender/50 rounded-full p-1 p-1">
                <button className="flex-1 bg-white text-ultra-indigo font-semibold text-sm py-2 rounded-full shadow-float/50">Próximas</button>
                <button className="flex-1 text-gray-500 font-semibold text-sm py-2 rounded-full hover:text-negro transition-colors">Pasadas</button>
              </div>
            </div>
            
            {/* Lista de Citas */}
            <div className="px-6 flex flex-col gap-4">
               {/* Month header */}
               <h3 className="text-sm font-semibold text-gray-500 mt-2 uppercase tracking-wider font-display tracking-tight">Octubre 2026</h3>
               
               {/* Appointment Card */}
               <div 
                 onClick={() => setCurrentView('appointment')}
                 className="bg-white rounded-[16px] p-5 flex flex-col gap-4 shadow-float/40 hover:border-ultra-indigo transition-colors cursor-pointer group"
               >
                 <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-[16px] bg-blue-50 flex items-center justify-center border border-blue-100 text-ultra-indigo group-hover:bg-ultra-indigo group-hover:text-white transition-colors">
                       <Heart size={24} strokeWidth={1.5} />
                     </div>
                     <div>
                       <p className="text-base font-semibold text-negro">Cardiología</p>
                       <p className="text-sm text-gray-500 font-medium">Dra. Elena Rivas</p>
                     </div>
                   </div>
                   <span className="bg-lima text-negro text-[11px] uppercase tracking-wide font-semibold px-3 py-1 rounded-full">Confirmada</span>
                 </div>
                 
                 <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-[12px] border border-gray-100">
                   <CalendarDays size={18} className="text-gray-500" />
                   <span className="text-sm font-semibold text-negro">15 Oct, 10:00 AM</span>
                 </div>
               </div>

               {/* Appointment Card 2 */}
               <div className="bg-white rounded-[16px] p-5 flex flex-col gap-4 shadow-float/40 hover:border-ultra-indigo transition-colors cursor-pointer group">
                 <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-[16px] bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                       <Sparkles size={24} strokeWidth={1.5} />
                     </div>
                     <div>
                       <p className="text-base font-semibold text-negro">Dermatología</p>
                       <p className="text-sm text-gray-500 font-medium">Dr. Carlos Perez</p>
                     </div>
                   </div>
                   <span className="bg-cyber-lavender text-ultra-indigo text-[11px] uppercase tracking-wide font-semibold px-3 py-1 rounded-full">Pendiente</span>
                 </div>
                 
                 <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-[12px] border border-gray-100">
                   <CalendarDays size={18} className="text-gray-500" />
                   <span className="text-sm font-semibold text-negro">22 Oct, 11:30 AM</span>
                 </div>
               </div>
            </div>
            
            {/* FAB */}
            <button className="absolute bottom-6 right-6 w-14 h-14 bg-lima text-negro rounded-full flex items-center justify-center shadow-float hover:scale-105 transition-transform active:scale-95 transition-all z-40">
               <Calendar size={26} />
               <div className="absolute bottom-3 right-3 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                 <span className="text-ultra-indigo text-xs font-semibold leading-none -mt-0.5">+</span>
               </div>
            </button>
          </main>
        </div>
      )}

      {currentView !== 'appointment' && (
        <nav className="absolute bottom-0 w-full bg-white flex justify-around items-center px-4 py-3 pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-50 rounded-t-[32px]">
          <button 
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center justify-center gap-1 w-16 py-2 rounded-[24px] transition-all ${currentView === 'home' ? 'bg-ultra-indigo text-white shadow-float shadow-ultra-indigo/20' : 'text-gray-400 hover:text-ultra-indigo'}`}
          >
            <Home size={22} className={currentView === 'home' ? 'fill-current' : ''} />
            <span className="text-[11px] font-semibold">Inicio</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('documents')}
            className={`flex flex-col items-center justify-center gap-1 w-16 py-2 rounded-[24px] transition-all ${currentView === 'documents' ? 'bg-ultra-indigo text-white shadow-float shadow-ultra-indigo/20' : 'text-gray-400 hover:text-ultra-indigo'}`}
          >
            <FileText size={22} className={currentView === 'documents' ? 'fill-current' : ''} />
            <span className="text-[11px] font-semibold">Documentos</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('citas')}
            className={`flex flex-col items-center justify-center gap-1 w-16 py-2 rounded-[24px] transition-all ${currentView === 'citas' ? 'bg-ultra-indigo text-white shadow-float shadow-ultra-indigo/20' : 'text-gray-400 hover:text-ultra-indigo'}`}
          >
            <CalendarDays size={22} className={currentView === 'citas' ? 'fill-current' : ''} />
            <span className="text-[11px] font-semibold">Citas</span>
          </button>
          
          <button className="flex flex-col items-center justify-center gap-1 w-16 py-2 rounded-[24px] transition-all text-gray-400 hover:text-ultra-indigo">
            <UserCircle size={22} />
            <span className="text-[11px] font-semibold">Perfil</span>
          </button>
        </nav>
      )}
      </div>
    </div>
  );
}
