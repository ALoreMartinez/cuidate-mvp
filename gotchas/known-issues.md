# Gotchas conocidos — Cuídate MVP

## `DISABLE_HMR` en `vite.config.ts`
Si `DISABLE_HMR=true`, se desactiva HMR y file watching (`watch: null`). Es intencional para
el entorno de Google AI Studio (evita parpadeo mientras un agente edita archivos). **No quitar
ni "arreglar"** aunque parezca una config rota — ver [[decisions/decisiones]] (origen AI Studio).

## No hay `tailwind.config.js`
Tailwind v4 usa CSS-first config. Los tokens están en `src/index.css` bajo `@theme`. Si buscas
un config file y no lo encuentras, es esperado — no falta, no existe por diseño. Ver
[[decisions/design]].

## `npm run lint` no es un linter
Solo corre `tsc --noEmit` (type-check). No hay ESLint instalado. No asumas que "lint pasó"
significa que el código sigue alguna guía de estilo, solo que tipa bien.

## `express`/`dotenv`/`@google/genai` en dependencias sin uso
Están en `package.json` y el script `clean` borra `server.js`, pero **no existe `server.js`**
en el repo. Es infraestructura preparada para una integración de backend/Gemini que aún no se
implementó. No es código muerto para borrar — es deuda planeada. Ver [[state/current]].

## Fuente "Nohemi" nunca se carga
`--font-display` referencia `"Nohemi", "Clash Display", sans-serif` pero solo Clash Display se
carga (vía Fontshare en `index.html`). El fallback funciona silenciosamente — no es un error,
pero si alguien espera ver Nohemi específicamente, no va a aparecer sin añadir su `@font-face`.

## `diagrama-flujo.html` con cambios sin commitear
A fecha 2026-07-22 este archivo tiene un diff grande sin commitear (migración de file-tree de
texto a gráfico interactivo). Antes de asumir que el diagrama refleja el estado final, correr
`git diff diagrama-flujo.html` o `git status`.

## `metadata.json` casi vacío
`name` y `description` están vacíos — es el manifest de AI Studio, no afecta el build de Vite,
pero sí la identificación del app dentro de AI Studio si se vuelve a sincronizar con esa plataforma.
