# Skill: añadir una vista nueva

Desde 2026-07-22 `App.tsx` es un shell delgado, no un monolito (ver [[decisions/decisiones]]).

1. Crear `src/views/NuevaView.tsx` recibiendo props (datos + callbacks), no fetch propio salvo
   que sea igual de local que `AppointmentView.tsx` (que sí hace su propio `useEffect`+fetch
   porque depende de un id de la URL/estado).
2. Extender el tipo `View` en `App.tsx` (`{name:'home'} | {name:'documents'} | ... | {name:'nueva'}`).
3. Añadir el bloque `{view.name === 'nueva' && <NuevaView .../>}` en el `return` de `App.tsx`.
4. Si la vista debe aparecer en la nav inferior: añadir un `<button>` en el bloque `<nav>` de
   `App.tsx`, siguiendo el patrón de `home`/`documents`/`citas` (icono de `lucide-react` + estado
   activo con `bg-ultra-indigo`).
5. Usar solo tokens del design system existente (colores `ultra-indigo`, `cyber-lavender`,
   `lima`, etc. y sombras `shadow-float`/`shadow-modal`) — no introducir colores ad-hoc. Ver
   [[decisions/design]] para la tabla completa de tokens.
6. Para datos: usar `src/api/client.ts` (`api.getX()`/`api.postX()`), no `fetch` directo — así
   los tipos (`DocumentRecord`, `Appointment`) quedan centralizados.

**Sigue sin haber router** (`useState` alcanza) — no introducir react-router sin revisar antes
[[decisions/decisiones]].
