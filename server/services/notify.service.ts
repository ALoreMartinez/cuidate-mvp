import { env } from '../config/env.ts';

export function buildWhatsAppLink(params: { phone?: string; message: string }): string {
  const base = params.phone ? `https://wa.me/${params.phone.replace(/\D/g, '')}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(params.message)}`;
}

export async function sendPackageEmail(params: {
  to: string;
  downloadUrl: string;
  appointmentLabel?: string;
}): Promise<{ sent: boolean; reason?: string }> {
  if (!env.RESEND_API_KEY) {
    return { sent: false, reason: 'RESEND_API_KEY no configurada — envío por correo deshabilitado.' };
  }

  const { Resend } = await import('resend');
  const resend = new Resend(env.RESEND_API_KEY);
  const subject = params.appointmentLabel
    ? `Documentos para imprimir — ${params.appointmentLabel}`
    : 'Documentos para imprimir — Cuídate';

  await resend.emails.send({
    from: 'Cuídate <onboarding@resend.dev>',
    to: params.to,
    subject,
    html: `<p>Hola,</p><p>Adjunto el enlace para descargar e imprimir los documentos solicitados:</p><p><a href="${params.downloadUrl}">${params.downloadUrl}</a></p><p>Este enlace expira en ${env.SIGNED_URL_TTL_HOURS} horas.</p>`,
  });

  return { sent: true };
}
