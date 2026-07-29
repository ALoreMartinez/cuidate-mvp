# Decisiones — Cuídate MVP

Formato: `YYYY-MM-DD — Decisión — Razón — Alternativa descartada (si aplica)`

---

## 2026-07-20 — Origen: scaffold de Google AI Studio
El proyecto nació como export de Google AI Studio (ver `metadata.json`, banner en `README.md`,
env vars `GEMINI_API_KEY`/`APP_URL` en `.env.example`, quirk `DISABLE_HMR` en `vite.config.ts`).
**Razón:** prototipado rápido de UI con Gemini como backend de IA previsto.
**Implicación:** no borrar el comentario/lógica de `DISABLE_HMR` en `vite.config.ts` — es requerido
por el entorno de AI Studio para evitar parpadeo al editar con agentes. Ver [[gotchas/known-issues]].

## 2026-07-20 — Tailwind v4 sin archivo de config
Los design tokens (colores, fuentes, sombras) se definen en `src/index.css` vía `@theme`,
no en `tailwind.config.js` (no existe). **Razón:** es el patrón nativo de Tailwind v4.
**Implicación:** para tocar el sistema de diseño, editar `src/index.css`, no buscar un config file.
Detalle completo en [[decisions/design]].

## 2026-07-20 — App monolítica en un solo componente (`App.tsx`, 547 líneas) — SUPERADA 2026-07-22
Las 4 vistas vivían en un único componente con `useState<string>` para el switch de vista, sin
router, todo con data hardcodeada. Superada el 2026-07-22 al componentizar (ver entrada de esa
fecha) — se mantiene aquí por histórico.

## 2026-07-22 — Backend real: Express + `node:sqlite` (no `better-sqlite3`)
Se construyeron las Fases 0-2 del plan de centralización de documentos (ver plan completo en
`C:\Users\Foodology SAS\.claude\plans\el-enfoque-es-la-parsed-salamander.md`): servidor Express
en `server/`, base de datos SQLite, documentos/citas/paquetes de impresión reales.
**Desviación del plan original:** el plan proponía `better-sqlite3`, pero esta máquina no tiene
Python/node-gyp funcional para compilar su addon nativo (`npm install` fallaba). Se usó
`node:sqlite` (`DatabaseSync`, built-in desde Node 22+, disponible en Node 24 instalado aquí) —
misma API `.prepare().get/all/run()`, cero dependencias nativas, más alineado aún con "stack
simple autocontenido". **Implicación:** no reintroducir `better-sqlite3`; si se necesita en el
futuro por alguna feature que `node:sqlite` no soporte, evaluar primero si de verdad hace falta.
Ver [[gotchas/known-issues]].

## 2026-07-22 — Frontend componentizado: `App.tsx` → shell + `src/views/*`
`App.tsx` pasó de monolito de 547 líneas a un shell delgado (~150 líneas) que hace fetch de
datos reales (`src/api/client.ts`) y rutea entre `src/views/{Home,Documents,Appointment,Citas}View.tsx`.
El estado de vista pasó de `string` a `{name, appointmentId?}` porque ahora hay entidades con id
real. **Razón:** ya no era sostenible un solo archivo una vez que cada vista necesita su propio
fetch/estado para datos reales. **Se mantiene `useState` sin router** (no se reabrió esa parte
de la decisión anterior — sigue sin justificarse mientras no haya deep-linking real).

## 2026-07-22 — CTA de impresión antes que auth real (Fase 2 antes que Fase 3)
El flujo "preparar documentos → generar PDF → enviar por WhatsApp/correo/compartir" se construyó
funcionando sobre un `requireAuth` con dev-user hardcodeado (`server/middleware/requireAuth.ts`),
sin esperar a Google Sign-In real. **Razón:** es el objetivo de negocio #1 priorizado
explícitamente por el usuario, y puede demostrarse sin bloquear en credenciales OAuth que aún no
existen. **Cuándo revisar:** al implementar la Fase 3 (auth real), `requireAuth` se reemplaza y
deja de haber un único usuario global — verificar que ningún endpoint asuma lo contrario.

## 2026-07-22 — Sistema de memoria persistente del proyecto
Se crea la estructura `AGENTS.md` + `decisions/` + `state/` + `skills/` + `gotchas/` + `logs/`
para que las sesiones de agente no pierdan contexto crítico entre conversaciones.
**Razón:** el repo se estaba quedando sin ningún registro de decisiones/estado fuera del código;
cada sesión nueva tenía que re-derivar todo leyendo `App.tsx` completo.
**Cómo usarlo:** ver `AGENTS.md` en la raíz — es el punto de entrada obligatorio.
