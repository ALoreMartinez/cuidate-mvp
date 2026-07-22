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

## 2026-07-20 — App monolítica en un solo componente (`App.tsx`, 547 líneas)
Las 4 vistas (home, appointment, documents, citas) viven en un único componente con
`useState<'home'|'appointment'|'documents'|'citas'>` para el switch de vista, sin router.
**Razón:** velocidad de iteración en etapa de mockup/MVP visual (todo el contenido es data
hardcodeada, no hay backend conectado aún).
**Alternativa descartada:** react-router — no se justifica mientras no haya URLs reales que
compartir ni necesidad de historial de navegación.
**Cuándo revisar esta decisión:** al conectar datos reales o si se necesita deep-linking
(compartir un link a una cita específica). Ver [[state/current]] y [[gotchas/known-issues]].

## 2026-07-22 — Sistema de memoria persistente del proyecto
Se crea la estructura `AGENTS.md` + `decisions/` + `state/` + `skills/` + `gotchas/` + `logs/`
para que las sesiones de agente no pierdan contexto crítico entre conversaciones.
**Razón:** el repo se estaba quedando sin ningún registro de decisiones/estado fuera del código;
cada sesión nueva tenía que re-derivar todo leyendo `App.tsx` completo.
**Cómo usarlo:** ver `AGENTS.md` en la raíz — es el punto de entrada obligatorio.
