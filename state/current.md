# Estado actual — Cuídate MVP
Última actualización: 2026-07-22

## Hecho
- Scaffold Vite 6 + React 19 + TS + Tailwind v4 (origen Google AI Studio).
- 4 vistas mockeadas en `src/App.tsx`: home, appointment (detalle de cita), documents, citas.
- Sistema de diseño con tokens propios en `src/index.css` (`@theme`). Ver [[decisions/design]].
- Fuentes Switzer + Clash Display cargadas vía Fontshare CDN.
- `diagrama-flujo.html`: doc visual del flujo del proyecto. En rediseño activo (ver Pendiente).
- Launch config de dev server para preview local (`.claude/launch.json`, puerto 3000).

## Pendiente / próximos pasos conocidos
- Terminar rediseño de `diagrama-flujo.html`: migrar el "file tree" de texto plano (`.tree` mono)
  a un árbol gráfico plegable (`.file-tree`/`<details>`). Cambio en curso, no commiteado
  (`git status` lo marca modificado desde 2026-07-20).
- Conectar backend real: `express` + `dotenv` + `@google/genai` están en dependencias pero no
  hay ningún `server.js` ni endpoint en el repo — es deuda planeada, no implementada.
- Decidir si se introduce react-router o se mantiene el switch por `useState` (ver
  [[decisions/decisiones]]) — revisar cuando haya datos reales o necesidad de compartir links.
- Componentizar `App.tsx` (547 líneas, todo en un archivo) si el proyecto crece más allá del
  mockup de 4 vistas.
- Rellenar `metadata.json` (`name`/`description` vacíos) y el `<title>` de `index.html`
  (sigue en "My Google AI Studio App", boilerplate sin personalizar).
- No hay tests ni ESLint configurado. `npm run lint` solo hace `tsc --noEmit` (chequeo de tipos).

## Blockers
Ninguno reportado por el usuario a la fecha. Actualizar esta sección en cuanto surja uno.

## Cómo actualizar este archivo
Al cerrar una sesión de trabajo relevante: mover lo completado de "Pendiente" a "Hecho",
añadir blockers nuevos, y si la sesión fue significativa, resumirla en `logs/`.
