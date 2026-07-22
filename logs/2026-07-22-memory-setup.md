# Log — 2026-07-22 — Setup de memoria persistente

**Qué se hizo:** análisis completo del repo (estructura, `App.tsx`, `index.css`,
`vite.config.ts`, `metadata.json`, `.env.example`, `diagrama-flujo.html`, historial git) y
creación de la estructura de memoria persistente: `AGENTS.md` + `decisions/` + `state/` +
`skills/` + `gotchas/` + `logs/`.

**Hallazgos clave que motivaron la estructura:**
- El repo no tenía ningún registro de decisiones o estado fuera del código — cada sesión debía
  releer `App.tsx` (547 líneas) completo para entender el proyecto.
- Varias piezas de contexto "invisible" solo derivable leyendo varios archivos a la vez (origen
  AI Studio, por qué `DISABLE_HMR`, por qué no hay `tailwind.config.js`, por qué `express` está
  en deps sin usarse) — ahora documentadas en [[gotchas/known-issues]] y [[decisions/decisiones]].
- `diagrama-flujo.html` tenía cambios sin commitear (migración de file-tree texto → gráfico) —
  registrado en [[state/current]] para que no se pierda de vista.

**Resultado:** `AGENTS.md` en la raíz como punto de entrada único; resto de contexto repartido
en carpetas temáticas, cada una referenciada desde `AGENTS.md`.

**Siguiente sesión debería:** confirmar si el rediseño de `diagrama-flujo.html` se terminó y
mover ese ítem de "Pendiente" a "Hecho" en [[state/current]], o seguir iterando sobre él.
