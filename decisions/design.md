# Decisiones de diseño — Cuídate MVP

## Producto
App móvil (mobile-first, contenedor fijo `max-w-[375px]`) tipo "compañero de salud" para
pacientes en español: próxima cita, carga de documentos médicos (fotos de fórmulas/análisis),
historial por especialidad, listado de citas. Todo el contenido visible hoy es mock data
(paciente "Usuario", Dra. Elena Rivas, documentos de ejemplo) — no hay backend ni auth real.

## Design tokens (`src/index.css`, bloque `@theme`)
| Token | Valor | Uso |
|---|---|---|
| `--color-prussian` | `#0C0061` | fondos oscuros (header de cita, cards destacadas) |
| `--color-ultra-indigo` | `#4C33FF` | color de marca / texto primario / nav activo |
| `--color-periwinkle` | `#9684FF` | acento secundario |
| `--color-cyber-lavender` | `#E5E6FF` | fondo general de pantalla (`bg-cyber-lavender/40`) |
| `--color-dried-lilac` | `#BCBDFF` | bordes dashed, detalles suaves |
| `--color-lima` | `#D4FF3D` | color de acción/CTA (botones primarios, FAB) |
| `--color-negro` | `#0A0A0A` | texto sobre fondos claros/lima |
| `--color-azul-info` | `#2A4BFF` | informativo (poco usado aún) |

Fuentes: `--font-display` = Clash Display (títulos), `--font-body` = Switzer (cuerpo).
Sombras: `--shadow-float` (cards), `--shadow-modal` (headers destacados).

Fuentes cargadas vía Fontshare CDN en `index.html` (Switzer + Clash Display).

## Patrón de vistas
Cada vista es un bloque condicional `{currentView === 'x' && (...)}` dentro del mismo
`return` de `App.tsx`. Estructura repetida por vista: `<header sticky>` + `<main scrollable>`
+ (opcional) `<nav inferior>` compartida entre home/documents/citas (se oculta en `appointment`).
Ver procedimiento en [[skills/add-view]].

## Por qué no hay componentización todavía
Es deliberado en esta etapa (mockup de flujo, no producto en producción). Ver decisión
correspondiente en [[decisions/decisiones]] (2026-07-20, App monolítica).
