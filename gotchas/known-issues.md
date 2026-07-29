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

## `diagrama-flujo.html` con cambios sin commitear
A fecha 2026-07-22 este archivo tiene un diff grande sin commitear (migración de file-tree de
texto a gráfico interactivo). Antes de asumir que el diagrama refleja el estado final, correr
`git diff diagrama-flujo.html` o `git status`.

## `metadata.json` casi vacío
`name` y `description` están vacíos — es el manifest de AI Studio, no afecta el build de Vite,
pero sí la identificación del app dentro de AI Studio si se vuelve a sincronizar con esa plataforma.

## El backend usa `node:sqlite`, no `better-sqlite3`
`better-sqlite3` requiere compilar un addon nativo (node-gyp + Python) y esta máquina no tiene
Python funcional — `npm install` fallaba con errores de `node-gyp`. Se usa el módulo built-in
`node:sqlite` (`DatabaseSync`, Node 22.5+/24 aquí) en `server/db/connection.ts`, con la misma API
`.prepare(sql).get/all/run(...)`. Si en el futuro alguien reintroduce `better-sqlite3` "porque el
plan original lo decía", va a volver a romper el install en esta máquina — no es necesario,
`node:sqlite` cubre todo lo usado hoy. Ver [[decisions/decisiones]].

## El backend lee `SERVER_PORT`, no `PORT`
El harness de preview inyecta `PORT=3000` como variable de entorno para el dev server de Vite
(coincide con el campo `"port"` de `.claude/launch.json`). Si el backend (`server/config/env.ts`)
también leyera `PORT`, Express intentaría bindear el mismo puerto 3000 que Vite y uno de los dos
"ganaría" la carrera silenciosamente (síntoma: la app carga pero todo lo que depende de `/api`
falla o se ve "Cannot GET /"). El backend usa `SERVER_PORT` (default 8787) a propósito — no
renombrar a `PORT` aunque parezca más consistente.

## `npm run dev:all` corre frontend + backend juntos
`.claude/launch.json` tiene dos configs: `cuidate-mvp-dev` (solo Vite, la vieja) y
`cuidate-mvp-dev-all` (Vite + Express vía `concurrently`, la que hay que usar ahora que existe
backend). Si el preview no responde en `/api/*`, verificar que se lanzó `cuidate-mvp-dev-all` y
no la config vieja.
