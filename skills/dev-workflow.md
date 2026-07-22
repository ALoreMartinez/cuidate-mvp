# Skill: correr y previsualizar la app

## Comandos
- `npm install` — instalar deps (requiere Node).
- `npm run dev` — Vite dev server, puerto 3000, host 0.0.0.0.
- `npm run build` — build de producción a `dist/`.
- `npm run preview` — sirve el build de `dist/`.
- `npm run lint` — solo type-check (`tsc --noEmit`), no es ESLint. Ver [[gotchas/known-issues]].
- `npm run clean` — borra `dist/` y `server.js` (este último no existe hoy).

## Preview con el harness (Claude Code)
Usar `.claude/launch.json` → configuración `cuidate-mvp-dev` (puerto 3000). No lanzar el dev
server con Bash: usar la herramienta de preview del harness para abrir el browser embebido.

## Variables de entorno
`GEMINI_API_KEY` y `APP_URL` van en `.env.local` (no versionado). Ver `.env.example` para el
formato. En AI Studio se inyectan automáticamente; en local hay que setearlas a mano si algún
día se conecta el backend de Gemini (hoy no hay backend implementado, ver [[state/current]]).
