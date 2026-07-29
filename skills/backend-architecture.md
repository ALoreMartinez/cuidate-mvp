# Skill: trabajar en el backend (`server/`)

## Estructura
```
server/
  config/env.ts        # zod, valida env vars. SERVER_PORT, no PORT (ver gotchas).
  db/
    connection.ts       # node:sqlite DatabaseSync, corre migrations/*.sql al boot
    migrations/001_init.sql
    seed.ts              # seed idempotente (solo si no existe DEV_USER_ID)
  middleware/{requireAuth,upload,errorHandler}.ts
  routes/{documents,appointments,packages,files}.routes.ts
  services/{storage,signedUrl,pdfMerge,notify}.service.ts
  index.ts               # bootstrap Express
```

## Reglas del patrón ya establecido
- Todas las tablas usan `id TEXT` (uuid v4 vía `crypto.randomUUID()`), no autoincrement.
- Toda ruta que toque datos de usuario pasa por `requireAuth` (hoy: dev-user stub, ver
  [[decisions/decisiones]] — Fase 3 lo reemplaza por sesión real, no asumir que `req.user.id`
  seguirá siendo siempre el mismo valor).
- Archivos en disco: nombre **uuid, nunca el original** (`multer` ya genera el nombre); rutas
  guardadas en SQLite con `path.posix.join` (forward slashes) aunque se ejecute en Windows — para
  que sigan siendo válidas si el proyecto se despliega en Linux. Ver [[gotchas/known-issues]] si
  aparece un `\\` en `storage_path`, es la señal de que alguien usó `path.join` en vez de
  `path.posix.join` al escribirlo.
- Descargas nunca son estáticas/públicas: siempre vía `createDownloadToken()` +
  `GET /api/files/:token` (`server/services/signedUrl.service.ts`), expirable
  (`SIGNED_URL_TTL_HOURS`).
- `db.prepare(sql).get/all/run(...)` es la única forma de tocar la base — no añadir un ORM sin
  discutirlo primero (mandato original del plan: "stack simple").

## Cómo añadir un endpoint nuevo
1. Si toca una tabla nueva: migración nueva en `server/db/migrations/00N_algo.sql` (no editar
   `001_init.sql` retroactivamente si ya hay datos de seed dependiendo de él).
2. Ruta en `server/routes/*.routes.ts` existente si encaja, o archivo nuevo + `app.use(...)` en
   `server/index.ts`.
3. Lógica no trivial (merge de PDF, envío, tokens) va en `server/services/`, no inline en la ruta.
4. Frontend: añadir el método correspondiente a `src/api/client.ts`, tipado — no `fetch` suelto
   en un componente.

## El merge de PDF (`pdfMerge.service.ts`)
PDFs se copian página a página con `pdf-lib`; imágenes (incluido HEIC de cámara de iPhone) se
normalizan a JPEG con `sharp` antes de embeberlas, porque `pdf-lib` no soporta HEIC. Si se agrega
un tipo de archivo nuevo al upload (`middleware/upload.ts` → `ALLOWED_MIME`), verificar que
`pdfMerge.service.ts` sepa manejarlo o falla en tiempo de generación del paquete, no de subida.

## Pendiente conocido (no reimplementar sin revisar el plan)
Auth real (Google OAuth), ingesta de Gmail/Outlook, y PWA/Web Share Target de WhatsApp son las
Fases 3-6 del plan original — diseño detallado en
`C:\Users\Foodology SAS\.claude\plans\el-enfoque-es-la-parsed-salamander.md`. No están
implementadas; `requireAuth` es un stub y no hay tablas `oauth_accounts`/`email_ingest_state`
pobladas todavía (sí existen en el schema de `001_init.sql`, listas para cuando se implemente).
