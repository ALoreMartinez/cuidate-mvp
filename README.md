# Cuídate MVP

App móvil de salud (en español) cuyo objetivo principal es ayudar a pacientes a reunir los
documentos necesarios para una cita médica y enviarlos fácilmente a una papelería para
imprimirlos (WhatsApp, correo o compartir genérico), junto con la gestión de citas y documentos.

Nació como export de [Google AI Studio](https://ai.studio/apps/cad6f9f1-1f8a-4277-84ad-53120c23c383)
(integración con Gemini vía `@google/genai`) y evolucionó a una app full-stack real.

## Stack

- **Frontend**: React 19 + TypeScript + Vite 6 + Tailwind CSS v4 (tokens en `src/index.css`, sin `tailwind.config.js`)
- **Backend**: Express + `node:sqlite` (módulo nativo de Node, sin dependencias de compilación)
- **Utilidades**: `pdf-lib`/`sharp` (merge de PDFs), `resend` (envío de correo, opcional), `jsonwebtoken`, `zod`

## Requisitos previos

- Node.js ≥ 22.5 (el backend usa el módulo nativo `node:sqlite`; no requiere Python ni herramientas de compilación)
- npm

## Instalación

```bash
npm install
```

Copia el archivo de variables de entorno de ejemplo y complétalo:

```bash
cp .env.example .env.local
```

| Variable | Requerida | Descripción |
|---|---|---|
| `GEMINI_API_KEY` | Sí (features de IA) | Clave de la API de Gemini. |
| `APP_URL` | No | URL pública de la app (links de retorno). |
| `SERVER_PORT` | No (default `8787`) | Puerto del backend Express. Distinto de `PORT`, que usa el dev server de Vite. |
| `DATABASE_PATH` | No | Ruta del archivo SQLite (`./storage/db/cuidate.sqlite` por defecto). |
| `UPLOADS_DIR` / `PACKAGES_DIR` | No | Carpetas de almacenamiento local de archivos subidos y paquetes de impresión generados. |
| `JWT_SECRET` | Sí | Firma la cookie de sesión. Generar con `openssl rand -base64 32`. |
| `ENCRYPTION_KEY` | Sí | Cifra tokens OAuth guardados (uso futuro, Fase 3+). Generar con `openssl rand -base64 32`. |
| `SIGNED_URL_TTL_HOURS` | No (default `48`) | Vigencia de los enlaces de descarga firmados. |
| `RESEND_API_KEY` | No | Habilita el envío del paquete de impresión por correo. Sin ella, WhatsApp y "compartir" siguen funcionando. |

**Nunca** subas `.env` o `.env.local` con valores reales — están ignorados en `.gitignore`; solo `.env.example` (con placeholders) debe versionarse.

## Ejecutar en desarrollo

```bash
npm run dev:all
```

Levanta frontend (Vite, `:3000`) y backend (Express, `:8787`) en paralelo. Alternativamente:

```bash
npm run dev         # solo frontend
npm run server:dev   # solo backend
```

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Dev server de Vite (frontend). |
| `npm run server:dev` | Dev server del backend con recarga automática (`tsx watch`). |
| `npm run dev:all` | Frontend + backend en paralelo. |
| `npm run build` | Build de producción del frontend. |
| `npm run server:build` | Bundlea el backend a `server.js` (esbuild). |
| `npm run start` | Corre el backend ya bundleado (`server.js`). |
| `npm run preview` | Sirve el build de producción del frontend localmente. |
| `npm run lint` | Type-check con `tsc --noEmit` (no hay ESLint configurado). |

## Estructura del proyecto

```
src/            Frontend (App.tsx + views/ + components/ + api/ client)
server/         Backend Express (routes/, services/, db/, middleware/)
storage/        Archivos locales: SQLite, uploads, paquetes generados (no versionado)
decisions/      Decisiones de arquitectura y diseño, con fecha y razón
gotchas/        Problemas conocidos y su explicación
skills/         Procedimientos paso a paso reutilizables (dev workflow, añadir vista, backend, tokens)
state/          Estado vivo del proyecto (hecho / pendiente / blockers)
```

## Estado del proyecto

El backend real (documentos, citas, paquetes de impresión) está implementado y conectado al
frontend. Auth real (Google Sign-In), ingesta automática de Gmail/Outlook y PWA/Web Share Target
siguen pendientes. Detalle completo y actualizado en [state/current.md](state/current.md).

## Para agentes / colaboradores

Este repo mantiene contexto de proyecto en archivos versionados en vez de depender de memoria de
chat. Antes de trabajar en el código, revisa [AGENTS.md](AGENTS.md) — es el punto de entrada a
decisiones, gotchas conocidos y skills documentadas.
