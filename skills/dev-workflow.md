# Skill: correr y previsualizar la app

## Comandos
- `npm install` — instalar deps (requiere Node; ver gotcha de `node:sqlite` si alguien reintroduce
  paquetes con addons nativos).
- `npm run dev` — solo Vite (frontend), puerto 3000. Sin backend, las llamadas a `/api/*` fallan.
- `npm run server:dev` — solo el backend (`tsx watch server/index.ts`), puerto `SERVER_PORT`
  (default 8787).
- `npm run dev:all` — **el comando normal para desarrollar**: frontend + backend juntos vía
  `concurrently`. Vite proxea `/api` al backend (ver `vite.config.ts`).
- `npm run build` — build de producción del frontend a `dist/`.
- `npm run server:build` — bundlea `server/index.ts` a `server.js` con `esbuild` (patrón que ya
  asumía el script `clean` desde el origen del proyecto). `npm start` corre ese `server.js`.
- `npm run lint` — solo type-check (`tsc --noEmit`), no es ESLint. Ver [[gotchas/known-issues]].
- `npm run clean` — borra `dist/` y `server.js` (el bundle, no el código fuente en `server/`).

## Preview con el harness (Claude Code)
`.claude/launch.json` tiene dos configs:
- `cuidate-mvp-dev` — solo Vite (vieja, previa al backend).
- `cuidate-mvp-dev-all` — **usar esta** (`npm run dev:all`). No lanzar el dev server con Bash:
  usar la herramienta de preview del harness para abrir el browser embebido.

## Variables de entorno
`.env.example` documenta todas: `GEMINI_API_KEY`/`APP_URL` (AI Studio) y las del backend
(`SERVER_PORT`, `DATABASE_PATH`, `UPLOADS_DIR`, `PACKAGES_DIR`, `JWT_SECRET`, `ENCRYPTION_KEY`,
`SIGNED_URL_TTL_HOURS`, `RESEND_API_KEY`). Van en `.env.local` (no versionado). Sin `.env.local`,
el backend arranca igual con valores por defecto razonables para desarrollo — solo el envío de
correo (`RESEND_API_KEY`) queda deshabilitado sin credencial.
