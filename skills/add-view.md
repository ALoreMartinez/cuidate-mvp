# Skill: añadir una vista nueva a `App.tsx`

Patrón actual (mientras siga vigente la decisión de app monolítica, ver [[decisions/decisiones]]):

1. Extender el union type del estado: `useState<'home'|'appointment'|'documents'|'citas'|'NUEVA'>`.
2. Añadir un bloque `{currentView === 'NUEVA' && (...)}` en el `return` de `App.tsx`, siguiendo
   la estructura de una vista existente: `<header sticky>` (con botón volver si no es raíz,
   patrón `<ArrowLeft onClick={() => setCurrentView('home')}>`) + `<main className="flex-1
   overflow-y-auto ... scrollbar-hide">`.
3. Si la vista debe aparecer en la nav inferior: añadir un `<button>` dentro del bloque
   `{currentView !== 'appointment' && (<nav>...)}` cerca de línea 512, siguiendo el patrón de
   `home`/`documents`/`citas` (icono de `lucide-react` + estado activo con `bg-ultra-indigo`).
4. Usar solo tokens del design system existente (colores `ultra-indigo`, `cyber-lavender`,
   `lima`, etc. y sombras `shadow-float`/`shadow-modal`) — no introducir colores ad-hoc. Ver
   [[decisions/design]] para la tabla completa de tokens.
5. Todo el contenido sigue siendo mock data inline (no hay fetch de API aún) — mantener
   consistencia con el resto del archivo hasta que se conecte un backend real.

**Cuándo NO seguir este patrón:** si el proyecto migra a react-router o se componentiza
`App.tsx` (ver decisión pendiente en [[state/current]]), actualizar este skill.
