import { useState } from 'react';
import { X, MessageCircle, Mail, Share2, Check } from 'lucide-react';
import { api } from '../../api/client';

interface Props {
  packageId: string;
  downloadUrl: string;
  onClose: () => void;
}

export function SendChannelSheet({ packageId, downloadUrl, onClose }: Props) {
  const [mode, setMode] = useState<'menu' | 'whatsapp' | 'email'>('menu');
  const [recipient, setRecipient] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sendWhatsapp = async () => {
    setBusy(true);
    try {
      const result = await api.sendPackage(packageId, 'whatsapp', recipient || undefined);
      if (result.link) window.open(result.link, '_blank');
      setStatus('Se abrió WhatsApp con tu paquete listo para enviar.');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'No se pudo generar el enlace.');
    } finally {
      setBusy(false);
    }
  };

  const sendEmail = async () => {
    if (!recipient) {
      setStatus('Escribe el correo de la papelería.');
      return;
    }
    setBusy(true);
    try {
      const result = await api.sendPackage(packageId, 'email', recipient);
      setStatus(result.sent ? `Correo enviado a ${recipient}.` : result.reason || 'No se pudo enviar el correo.');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'No se pudo enviar el correo.');
    } finally {
      setBusy(false);
    }
  };

  const shareGeneric = async () => {
    setBusy(true);
    try {
      await api.sendPackage(packageId, 'share');
      const absoluteUrl = new URL(downloadUrl, window.location.origin).toString();
      if (navigator.share) {
        await navigator.share({ title: 'Documentos para imprimir', url: absoluteUrl });
      } else {
        await navigator.clipboard.writeText(absoluteUrl);
        setStatus('Enlace copiado al portapapeles.');
      }
    } catch {
      // El usuario canceló el share sheet nativo — no es un error a mostrar.
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-[375px] bg-white rounded-t-[32px] shadow-modal" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-semibold text-ultra-indigo font-display tracking-tight">Enviar a imprimir</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-3">
          {mode === 'menu' && (
            <>
              <button
                onClick={() => setMode('whatsapp')}
                className="flex items-center gap-3 p-4 rounded-[16px] border border-gray-100 hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <MessageCircle size={20} />
                </div>
                <span className="text-sm font-semibold text-negro">Enviar por WhatsApp</span>
              </button>
              <button
                onClick={() => setMode('email')}
                className="flex items-center gap-3 p-4 rounded-[16px] border border-gray-100 hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-ultra-indigo">
                  <Mail size={20} />
                </div>
                <span className="text-sm font-semibold text-negro">Enviar por correo</span>
              </button>
              <button
                onClick={shareGeneric}
                disabled={busy}
                className="flex items-center gap-3 p-4 rounded-[16px] border border-gray-100 hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                <div className="w-10 h-10 rounded-full bg-cyber-lavender flex items-center justify-center text-ultra-indigo">
                  <Share2 size={20} />
                </div>
                <span className="text-sm font-semibold text-negro">Compartir enlace</span>
              </button>
            </>
          )}

          {mode === 'whatsapp' && (
            <>
              <p className="text-xs text-gray-500">
                Número de la papelería (opcional) — si lo dejas vacío, eliges el contacto dentro de WhatsApp.
              </p>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Ej. 3001234567"
                className="w-full border border-gray-200 rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-ultra-indigo"
              />
              <button
                onClick={sendWhatsapp}
                disabled={busy}
                className="w-full bg-lima text-negro font-semibold text-sm py-3 rounded-full shadow-float disabled:opacity-60 active:scale-[0.98] transition-all"
              >
                {busy ? 'Abriendo...' : 'Abrir WhatsApp'}
              </button>
            </>
          )}

          {mode === 'email' && (
            <>
              <p className="text-xs text-gray-500">Correo de la papelería</p>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="papeleria@correo.com"
                className="w-full border border-gray-200 rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-ultra-indigo"
              />
              <button
                onClick={sendEmail}
                disabled={busy}
                className="w-full bg-lima text-negro font-semibold text-sm py-3 rounded-full shadow-float disabled:opacity-60 active:scale-[0.98] transition-all"
              >
                {busy ? 'Enviando...' : 'Enviar correo'}
              </button>
            </>
          )}

          {status && (
            <div className="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-[12px] p-3 mt-1">
              <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700">{status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
