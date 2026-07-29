# AGENTS.md — Cuídate MVP

Punto de entrada único para cualquier agente que trabaje en este repo. Leer esto primero,
siempre. El resto del contexto vive en archivos, no en esta conversación.

## 1. Identidad y propósito del proyecto

**Cuídate MVP** es una app móvil de salud para pacientes, en español, cuyo CTA principal es
reunir los documentos necesarios para una cita física y enviarlos fácilmente a una papelería
para imprimirlos (por WhatsApp o correo), más la ingesta automática de esos documentos desde
email/WhatsApp. Nació como export de **Google AI Studio** (integración con Gemini vía
`@google/genai`).

Estado real hoy: **backend real (Fases 0-2 del plan) + frontend conectado**. Express + SQLite
(`node:sqlite`) sirven documentos/citas/paquetes de impresión reales; el frontend (`src/App.tsx`
+ `src/views/`) consume esa API, sin datos hardcodeados. Auth real, ingesta de Gmail/Outlook y
PWA/WhatsApp share-target (Fases 3-6) siguen pendientes — requieren credenciales externas que
solo el usuario puede crear. Detalle completo en [state/current.md](state/current.md) y en el
plan original: `C:\Users\Foodology SAS\.claude\plans\el-enfoque-es-la-parsed-salamander.md`.

## 2. Reglas duras e invariantes

- El context window es caro y volátil. **La memoria real vive en archivos**, no en el historial
  de chat. Si algo importa para el futuro, se escribe aquí — no se asume que "se va a recordar".
- Nunca cargar todo el historial de git ni todos los archivos del proyecto de una vez. Cargar
  solo lo estrictamente necesario para la tarea actual (ver orden de lectura abajo).
- Preferir **referenciar** un archivo (`ver src/App.tsx:120`) antes que copiar su contenido
  largo dentro de un prompt o de un archivo de memoria.
- No tocar `vite.config.ts` (`DISABLE_HMR`) pensando que es config rota — es intencional para
  AI Studio. Ver [gotchas/known-issues.md](gotchas/known-issues.md).
- No buscar `tailwind.config.js` — no existe, Tailwind v4 usa `@theme` en `src/index.css`.
- No buscar `better-sqlite3` — el backend usa `node:sqlite` (built-in de Node, sin compilación
  nativa). Ver [gotchas/known-issues.md](gotchas/known-issues.md).
- El backend lee `SERVER_PORT`, nunca `PORT` — `PORT` está reservado para el dev server de Vite
  en este entorno. Ver el mismo gotcha antes de tocar `server/config/env.ts` o `vite.config.ts`.
- Convertir cualquier procedimiento que se repita 2+ veces en un archivo dentro de `skills/`.
- Mantener este archivo (`AGENTS.md`) por debajo de ~300 líneas y de alta densidad de
  información. Si crece, mover detalle a la carpeta correspondiente y dejar aquí solo el puntero.
- Al final de cualquier sesión de trabajo no trivial: actualizar [state/current.md](state/current.md),
  registrar decisiones nuevas en `decisions/`, y si la sesión fue significativa, comprimir lo
  valioso en un archivo nuevo dentro de `logs/`.

## 3. Orden de lectura preferido

Para entender el proyecto desde cero, en este orden (parar en cuanto se tenga lo necesario):

1. Este archivo (`AGENTS.md`).
2. [state/current.md](state/current.md) — qué está hecho, pendiente, y blockers.
3. [gotchas/known-issues.md](gotchas/known-issues.md) — antes de tocar config o deps.
4. `decisions/decisiones.md` o `decisions/design.md` — solo si la tarea toca arquitectura o UI.
5. `src/App.tsx` + `src/views/*.tsx` (frontend) o `server/**` (backend) — solo la vista/ruta/
   servicio puntual relevante a la tarea. Usar Grep para localizar, no leer todo el árbol.
6. `skills/*.md` — el procedimiento específico si existe uno para la tarea (correr el dev
   server, añadir una vista, tocar el design system, tocar el backend).

Nunca es necesario leer `package-lock.json`, `node_modules/`, ni `diagrama-flujo.html` completo
salvo que la tarea sea específicamente sobre ese diagrama.

## 4. Routing de skills (qué usar según la tarea)

| Tipo de tarea | Archivo |
|---|---|
| Correr/previsualizar la app (frontend+backend), comandos npm | [skills/dev-workflow.md](skills/dev-workflow.md) |
| Añadir o modificar una vista en `App.tsx`/`src/views/` | [skills/add-view.md](skills/add-view.md) |
| Añadir/cambiar un color, fuente o sombra | [skills/design-tokens.md](skills/design-tokens.md) |
| Tocar el backend (rutas, DB, servicios en `server/`) | [skills/backend-architecture.md](skills/backend-architecture.md) |
| Duda sobre por qué algo está como está | [gotchas/known-issues.md](gotchas/known-issues.md) → si no está, `decisions/decisiones.md` |
| Tarea de UI/branding nueva | [decisions/design.md](decisions/design.md) primero, para no romper el sistema de tokens existente |

Si una tarea no encaja en ninguna skill existente y es probable que se repita, crear un archivo
nuevo en `skills/` al terminar la tarea.

## 5. Definition of Done

Una tarea se considera terminada cuando:
- El código compila (`npm run lint`, que es type-check con `tsc --noEmit`).
- Si el cambio es visible en UI, se verificó en el preview del browser (no solo "debería
  funcionar") — screenshot o inspección de `read_page`/consola sin errores nuevos.
- Se usaron los tokens del design system existentes, no colores/fuentes ad-hoc (salvo que la
  tarea sea explícitamente añadir un token nuevo, en cuyo caso seguir [skills/design-tokens.md](skills/design-tokens.md)).
- Si se tomó una decisión de arquitectura o diseño no trivial, quedó registrada en `decisions/`
  con fecha y razón (no solo el qué, también el porqué).
- [state/current.md](state/current.md) refleja la realidad post-cambio (mover de Pendiente a Hecho,
  añadir blockers nuevos si aparecieron).
- No se dejaron TODOs a medio hacer sin anotar en "Pendiente".

## 6. Cómo comportarse con el contexto (instrucciones para el agente)

- Al empezar una sesión: leer `AGENTS.md` + `state/current.md`. No releer todo el repo por
  costumbre — solo lo que la tarea puntual requiera (ver sección 3).
- Si el usuario menciona algo que contradice un archivo de memoria (p. ej. "ya no usamos X"),
  actualizar ese archivo de inmediato, no dejar la memoria desactualizada.
- Si se descubre un problema conocido que no está documentado, añadirlo a `gotchas/` en el
  momento, no esperar a que se repita.
- Preferir density sobre prosa: listas, tablas, referencias cruzadas `[[archivo]]` en vez de
  párrafos largos repitiendo contexto que ya vive en otro archivo.
- Nunca dupliques contenido entre `decisions/`, `state/`, `gotchas/` y `skills/` — cada hecho
  vive en un solo lugar y el resto referencia con un link relativo.

## 7. Mapa de carpetas de memoria

- **`decisions/`** — decisiones importantes con fecha y razonamiento. `decisiones.md` = log
  cronológico general; `design.md` = decisiones específicas de UI/design system.
- **`state/`** — `current.md`: estado vivo del proyecto (hecho/pendiente/blockers). Se
  actualiza, no se acumula histórico (para histórico, ver `logs/`).
- **`skills/`** — procedimientos reutilizables paso a paso (cómo correr, cómo añadir vista,
  cómo tocar tokens de diseño).
- **`gotchas/`** — problemas conocidos y su explicación/solución, para no re-descubrirlos.
- **`logs/`** — resúmenes comprimidos de sesiones importantes, uno por archivo, con fecha en el
  nombre (`YYYY-MM-DD-tema.md`). No es un diario exhaustivo: solo sesiones con valor real para
  el futuro.
