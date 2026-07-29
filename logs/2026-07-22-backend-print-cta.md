# Log — 2026-07-22 — Backend real + CTA de impresión (Fases 0-2)

**Qué se hizo:** implementación de las Fases 0-2 del plan de centralización de documentos
(`C:\Users\Foodology SAS\.claude\plans\el-enfoque-es-la-parsed-salamander.md`):
- Backend Express + `node:sqlite` en `server/` (documentos, citas, paquetes de impresión).
- Frontend componentizado (`App.tsx` shell + `src/views/*`), conectado a la API real.
- Nuevo CTA principal en `AppointmentView`: "Preparar documentos para la cita" → selección de
  documentos → merge a PDF → envío por WhatsApp/correo/compartir.
- Subida manual de documentos (botón + FAB, antes decorativos) con clasificación post-subida.
- Verificado end-to-end en el navegador embebido (documentos, filtro por categoría, generación
  de paquete, link de WhatsApp) y vía API directa (subida, clasificación) donde el navegador
  headless no puede simular un `<input type=file>`.

**Decisiones no previstas en el plan original (ajustadas durante la implementación):**
- `better-sqlite3` no pudo instalarse en esta máquina (sin Python/node-gyp funcional) → se usó
  `node:sqlite` (built-in de Node 22+), misma API, cero deps nativas. Ver [[decisions/decisiones]].
- El harness de preview inyecta `PORT=3000` para Vite — el backend usa `SERVER_PORT` para no
  competir por el mismo puerto (causaba "Cannot GET /" silencioso). Ver [[gotchas/known-issues]].
- Se corrigió un bug de UX descubierto durante la verificación: el selector de "preparar
  paquete" preseleccionaba documentos `pending_review` ya vinculados a la cita que no aparecían
  en la lista visible (que solo traía confirmados) — el conteo no coincidía con lo marcado. Se
  unificó la lista para incluir siempre los documentos ya vinculados, sin importar su status.
- Se simplificó `AppointmentView`: se quitó el timeline "Historial de Cardiología" del mock
  original (data hardcodeada no ligada a la cita real abierta, sin entidad correspondiente en el
  modelo de datos). Documentado en [[state/current]] para que no se lea como una regresión.

**Qué falta (Fases 3-6, ver el plan y `state/current.md`):** auth real (Google Sign-In), ingesta
de Gmail/Outlook, PWA + Web Share Target de Android. Todas bloqueadas por credenciales externas
(Google Cloud Console) que solo el usuario puede crear — no son blockers técnicos internos.

**Siguiente sesión debería:** preguntar al usuario si ya tiene o puede crear credenciales de
Google Cloud OAuth antes de empezar la Fase 3; si no, no hay avance posible en auth/Gmail hasta
que existan.
