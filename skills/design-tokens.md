# Skill: añadir/modificar un design token

1. Editar el bloque `@theme` en `src/index.css` (NO buscar `tailwind.config.js`, no existe —
   Tailwind v4 usa CSS-first config).
2. Convención de nombres: `--color-{nombre}`, `--font-{rol}`, `--shadow-{nombre}`. Tailwind
   genera automáticamente las clases utilitarias (`bg-{nombre}`, `text-{nombre}`, etc.) a partir
   del nombre tras el prefijo.
3. Documentar el token nuevo en la tabla de [[decisions/design]] (valor + uso) para que no se
   pierda el porqué.
4. Si el token es una fuente nueva, verificar que se cargue de verdad (link en `index.html` o
   `@font-face`) — no asumir que basta con nombrarla en `@theme`. Ver caso "Nohemi" en
   [[gotchas/known-issues]].
