# Estado actual — Cuídate MVP
Última actualización: 2026-07-22

## Hecho
- Scaffold Vite 6 + React 19 + TS + Tailwind v4 (origen Google AI Studio).
- Sistema de diseño con tokens propios en `src/index.css` (`@theme`). Ver [[decisions/design]].
- Fuentes Switzer + Clash Display cargadas vía Fontshare CDN.
- `diagrama-flujo.html`: doc visual del flujo del proyecto. En rediseño activo (ver Pendiente).
- Launch config de dev server para preview local (`.claude/launch.json`): `cuidate-mvp-dev-all`
  corre frontend + backend juntos (`npm run dev:all`).
- **Backend real (Fases 0-2 del plan de centralización de documentos)**: Express + `node:sqlite`
  en `server/`, seed de datos de ejemplo, subida manual de documentos, CRUD de documentos/citas,
  generación de paquete de impresión (merge a PDF con `pdf-lib`/`sharp`) y envío por
  WhatsApp (`wa.me`)/correo (`resend`, opcional)/compartir genérico. Ver
  [skills/backend-architecture.md](../skills/backend-architecture.md) y el plan completo en
  `C:\Users\Foodology SAS\.claude\plans\el-enfoque-es-la-parsed-salamander.md`.
- Frontend componentizado: `App.tsx` (shell) + `src/views/*.tsx`, conectado a la API real vía
  `src/api/client.ts`. El nuevo CTA principal ("Preparar documentos para la cita") vive en
  `src/views/AppointmentView.tsx`.
- Verificado end-to-end en el navegador: listar/filtrar documentos, generar paquete de
  impresión, enlace de WhatsApp, listado de citas real. Subida manual y clasificación
  verificadas vía API directa (el navegador headless no puede simular el `<input type=file>`).

## Pendiente / próximos pasos conocidos
- **Fase 3 — Auth real (Google Sign-In)**: reemplazar el dev-user stub de
  `server/middleware/requireAuth.ts`. Requiere que el usuario cree un proyecto en Google Cloud
  Console y configure la pantalla de consentimiento OAuth — prerequisito fuera de código.
- **Fase 4 — Ingesta de Gmail**: bloqueada por lo mismo (credenciales OAuth) más la limitación de
  verificación de Google (`gmail.readonly` es scope restringido, máx. 100 testers en modo
  Testing hasta pasar revisión CASA) — ver el plan completo para el detalle de riesgos.
- **Fase 5 — Outlook** (opcional) y **Fase 6 — PWA/Web Share Target de Android + pulido**:
  sin empezar, dependen de las fases anteriores.
- Envío por correo del paquete de impresión requiere `RESEND_API_KEY` en `.env.local` — sin ella,
  el endpoint responde `sent:false` con motivo, WhatsApp y "compartir" siguen funcionando igual.
- Terminar rediseño de `diagrama-flujo.html` (sigue sin commitear, cambio de sesiones previas,
  no tocado en esta sesión).
- Rellenar `metadata.json` (`name`/`description` vacíos) y el `<title>` de `index.html`.
- No hay tests automatizados ni ESLint. `npm run lint` solo hace `tsc --noEmit`.
- Se simplificó `AppointmentView` respecto al mock original: se quitó la sección "Historial de
  Cardiología" (era data hardcodeada no ligada a la cita real que se estuviera viendo — no hay
  entidad de "historial de consultas" en el modelo de datos actual). Si se quiere esa feature,
  es trabajo nuevo, no una regresión a arreglar.

## Blockers
Ninguno reportado por el usuario a la fecha. Las Fases 3+ están bloqueadas por credenciales
externas (Google Cloud OAuth) que solo el usuario puede crear — no es un blocker técnico interno.

## Cómo actualizar este archivo
Al cerrar una sesión de trabajo relevante: mover lo completado de "Pendiente" a "Hecho",
añadir blockers nuevos, y si la sesión fue significativa, resumirla en `logs/`.
