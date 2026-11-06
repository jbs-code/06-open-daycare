# SPEC 02 — Pantallas Niños `/kids` y perfil `/kids/[slug]`

> **Status:** Implementado
> **Depends on:** SPEC 01
> **Date:** 2026-11-04
> **Objective:** Construir las pantallas `/kids` y `/kids/[slug]` como réplicas visuales de `references/pantallas/ninos.dc.html` y `references/pantallas/perfil-nino.dc.html` con data ficticia, navegables desde el item "Niños" del sidebar.

## Scope

**In:**

- Ruta `/kids`: header "GESTIÓN / Niños" + botón "Agregar niño", barra de búsqueda **solo visual**, label "SALA SOLES · 8 niños" con línea divisoria, y grilla responsivo con las 8 tarjetas del mockup.
- Tarjeta de niño: avatar circular con inicial y color propio, nombre, subtítulo ("3 años · 2 padres vinculados" / "sin padres vinculados"), badge (MANÍ, LACTOSA, VINCULAR) o chevron a la derecha. Hover: borde `#F2A78E` + `translateY(-2px)` con transición .15s. La tarjeta es un link a `/kids/{slug}`.
- Ruta `/kids/[slug]`: "Volver a Niños" → `/kids`, perfil con avatar 84px, nombre, "3 años · Sala Soles", botón "Editar", caja roja "Alergias y notas" (**solo si el niño tiene datos**), tarjeta de detalles (Fecha de nacimiento / Sala / Ingreso).
- Columna derecha del perfil (300px): botón oscuro "Resumen del día" y tarjeta "PADRES VINCULADOS" con lista de padres (badge ACTIVA/PENDIENTE) + "Vincular otro padre".
- Slug inválido → `notFound()` (404 nativa de Next).
- Sidebar: `SidebarContent` pasa a client component con `usePathname()`; item activo según ruta. Links reales: Feed → `/`, Niños → `/kids`. Avisos y Mi cuenta siguen en `#`.
- Data ficticia de los 8 niños en un archivo nuevo `lib/children.ts`.
- Iconos nuevos en `components/icons.tsx`: `SearchIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `AlertTriangleIcon`.
- Responsive: grilla de 1 columna bajo `sm` (640px) y 2 desde `sm`; sidebar/drawer móvil reutilizados de SPEC 01 sin cambios.

**Out of scope (for future specs):**

- Funcionalidad: buscar/filtrar niños, crear/editar niño ("Agregar niño"/"Editar"), "Resumen del día", "Vincular otro padre", "Nueva publicación".
- Pantallas Avisos, Mi cuenta, Login, Crear publicación, Resumen del día, Vincular padre, Agregar niño.
- Datos reales o persistencia (API, base de datos).
- Breadcrumb, metadatos/títulos por ruta, página 404 personalizada.

## Data model

```ts
// lib/children.ts
export type ParentStatus = "active" | "pending";

export interface Parent {
  fullName: string;   // "Lucía Fernández"
  initial: string;    // "L"
  relation: string;   // "Mamá" | "Papá"
  status: ParentStatus;
  avatarBg: string;   // "#C9B6E8"
}

export type BadgeTone = "alert" | "action";

export interface ChildBadge {
  label: string;      // "MANÍ" | "LACTOSA" | "VINCULAR"
  tone: BadgeTone;
}

export interface Child {
  slug: string;         // "mateo-fernandez"
  fullName: string;     // "Mateo Fernández"
  initial: string;      // "M"
  ageYears: number;     // 3
  avatarBg: string;     // "#A9D9E8"
  avatarInk: string;    // "#1F7A93"
  badge?: ChildBadge;
  birthDate: string;    // "12 mar 2022"
  roomName: string;     // "Soles"
  admission: string;    // "feb 2025"
  allergies?: string;   // solo Mateo
  parents: Parent[];
}

export const children: Child[]; // 8 niños, en orden del mockup
export const childrenRoomLabel: string; // "SALA SOLES"
export function getChildBySlug(slug: string): Child | undefined;
export function childSubtitle(child: Child): string;
```

Mapeo de tonos de badge (colores exactos del mockup):

| `BadgeTone` | Uso | Labels | BG / texto |
| --- | --- | --- | --- |
| `"alert"` | restricción alimentaria | `MANÍ`, `LACTOSA` | `#FBD8CC` / `#D9684A` |
| `"action"` | acción pendiente | `VINCULAR` | `#F9D2DE` / `#C56486` |

Convenciones de `childSubtitle`:

- `parents.length === 0` → `"2 años · sin padres vinculados"` (sin número).
- `parents.length === 1` → `"3 años · 1 padre vinculado"` (singular).
- `parents.length >= 2` → `"3 años · 2 padres vinculados"` (plural).

Colores de avatar de niño (texto sobre fondo, fuente Fredoka): Mateo/Lucas `#A9D9E8`/`#1F7A93`, Sofía/Emma `#F4B8CC`/`#C44A7A`, Benjamín/Olivia `#B9DEC4`/`#3E8B62`, Valentina `#F4DC8E`/`#9A7B1E`, Tomás `#C9B6E8`/`#7B5FC0`.

Badge de estado de padre: `active` → `ACTIVA` (`#CFEBD8`/`#3E9B6C`); `pending` → `PENDIENTE` (`#F7E7A6`/`#9A7B1E`).

Los 7 niños que no son Mateo llevan data completa inventada (fecha de nacimiento, ingreso y 0–2 padres), para que cualquier `/kids/{slug}` se vea coherente. Solo Valentina Soto tiene `parents: []` y ningún niño distinto de Mateo tiene `allergies`.

## Implementation plan

1. **Iconos nuevos en `components/icons.tsx`.** `SearchIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `AlertTriangleIcon` con los `path` exactos de los SVG del mockup (mismo patrón que los existentes). Verificar: `npx tsc --noEmit` sin errores.
2. **Data en `lib/children.ts`.** Interfaces (`Child`, `ChildBadge`, `Parent`, `ParentStatus`), los 8 niños con textos/colores textuales del mockup, y helpers `getChildBySlug` / `childSubtitle`. Verificar: compila sin errores y `childSubtitle` cubre los 3 casos de plural.
3. **Listado `/kids`.** `features/kids/KidsHeader.tsx` (eyebrow "GESTIÓN" + h1 "Niños" + link "Agregar niño" a `#`), `features/kids/KidCard.tsx` (tarjeta link con hover) y `app/kids/page.tsx` (header, input de búsqueda inerte con ícono, label "SALA SOLES · 8 niños", grilla `grid-cols-1 sm:grid-cols-2`, sidebar desktop + móvil). Verificar: `/kids` replica `ninos.dc.html` en desktop.
4. **Perfil `/kids/[slug]`.** `features/kids/ChildProfileHeader.tsx` (avatar 84px + nombre + "Editar"), `AllergyAlert.tsx` (renderiza solo con `allergies`), `ChildDetailsCard.tsx` (3 filas), `ParentsCard.tsx` (padres + "Vincular otro padre") y `app/kids/[slug]/page.tsx` con `const { slug } = await params` + `notFound()` si `getChildBySlug` devuelve `undefined`. Verificar: `/kids/mateo-fernandez` replica `perfil-nino.dc.html` y `/kids/pepe` devuelve 404.
5. **Sidebar con ruta activa.** `features/sidebar/SidebarContent.tsx` → `"use client"` + `usePathname()`; `NAV_ITEMS` con `href`: Feed `/`, Niños `/kids`, Avisos `#`, Mi cuenta `#`. Activo = `pathname === href` para `/` y `pathname.startsWith("/kids")` para el resto de rutas reales. Verificar: en `/` resalta Feed, en `/kids` resalta Niños, y el link navega (desktop y drawer móvil).
6. **Verificación final.** `npm run build` + `npx tsc --noEmit` sin errores; capturas con Playwright a 1440px y 375px comparadas contra ambos mockups.

## Acceptance criteria

- [x] `npm run build` y `npx tsc --noEmit` terminan sin errores.
- [x] `/kids` en desktop replica `ninos.dc.html`: header "GESTIÓN/Niños" + "Agregar niño", buscador, label "SALA SOLES · 8 niños" con línea, y 8 tarjetas en 2 columnas con nombres, textos de subtítulo, colores de avatar y badges exactos del mockup.
- [x] Cada tarjeta de `/kids` navega a `/kids/{slug}` y al hover muestra borde `#F2A78E` y sube 2px.
- [x] `/kids/mateo-fernandez` replica `perfil-nino.dc.html`: "Volver a Niños", avatar 84px, "3 años · Sala Soles", "Editar", caja de alergias con su texto, tarjeta con Fecha de nacimiento `12 mar 2022` / Sala `Soles` / Ingreso `feb 2025`, y columna derecha con "Resumen del día" + "PADRES VINCULADOS" (Lucía ACTIVA, Diego PENDIENTE, "Vincular otro padre").
- [x] "Volver a Niños" lleva a `/kids`.
- [x] Los 8 slugs renderizan perfil; los 7 niños sin `allergies` no muestran la caja roja; Valentina muestra la tarjeta de padres vacía + "Vincular otro padre".
- [x] `/kids/pepe` devuelve 404 (`notFound()`).
- [x] En `/kids` y `/kids/{slug}` el item "Niños" del sidebar aparece resaltado; en `/` lo hace "Feed".
- [x] "Niños" navega a `/kids` y "Feed" a `/` tanto en la sidebar desktop como en el drawer móvil; "Avisos" y "Mi cuenta" siguen en `#` (sin 404).
- [x] El input de búsqueda está visible con su ícono y no filtra (inerte).
- [x] A 375px no hay scroll horizontal: la grilla baja a 1 columna y el drawer móvil sigue abriéndose/cerrando.
- [x] No hay llamadas a red ni estado de datos: render estático con `lib/children.ts` (el único estado local es el `isOpen` del drawer, heredado de SPEC 01).

## Decisions

- **Yes:** `usePathname()` en `SidebarContent` (client component) para el item activo. DRY: desktop y drawer quedan sincronizados sin pasar props desde cada página.
- **No:** prop `activeItem` desde cada `page.tsx`. Duplicaría props en dos layouts y se olvida al agregar rutas.
- **Yes:** data completa (fecha, ingreso, padres) para los 8 niños. Cualquier `/kids/{slug}` se ve coherente.
- **No:** solo Mateo con padres. Las otras 7 pantallas quedarían vacías o inventando datos en runtime.
- **Yes:** caja de alergias condicional (`allergies?`). Fidelidad al mockup, que solo la muestra en Mateo.
- **No:** caja siempre visible con texto genérico. Inventaría contenido que el mockup no tiene.
- **Yes:** `notFound()` ante slug inválido. 404 nativa de Next, sin código extra.
- **No:** redirigir a `/kids`. Oculta el error y no está en el mockup.
- **Yes:** búsqueda solo visual (decidido con el usuario). Consistente con SPEC 01: cero funcionalidad.
- **No:** filtro en vivo por nombre. Alcance nuevo; si se quiere, va en otro spec.
- **Yes:** grilla responsivo `grid-cols-1 sm:grid-cols-2`. Desktop idéntico al mockup; móvil legible.
- **No:** grilla literal de 2 columnas en todos los anchos. Queda apretada a 375px.
- **Yes:** `lib/children.ts` separado de `lib/mockData.ts`. Dominios distintos (feed vs. niños), como `lib/postKinds.ts`.
- **No:** agregar los niños a `mockData.ts`. Mezcla dominios y crece sin control.
- **Yes:** botones sin pantalla propia ("Agregar niño", "Editar", "Resumen del día", "Vincular otro padre") con `href="#"`. Patrón de SPEC 01 para no romper con 404.
- **No:** crear esas rutas "para que el link funcione". Pantallas inventadas fuera de alcance.
- **Yes:** colores de avatar/badge como valores Tailwind arbitrarios (`bg-[#A9D9E8]`) desde la data. No requiere tocar `globals.css`.
- **No:** agregar 8 tokens de color por niño al `@theme`. Colapsaría la paleta global con colores de un solo uso.

## Risks

| Risk | Mitigation |
| --- | --- |
| `params` es `Promise` en Next 16 → error al leerlo síncrono | Paso 4 usa `await params`; `npx tsc --noEmit` lo detecta |
| Colores/textos hardcodeados divergen del mockup | Valores literales extraídos del HTML de los mockups; comparación visual con Playwright en el paso 6 |
| `SidebarContent` client rompe el render server de `Sidebar` | `MobileSidebar` ya es client; importar un client component desde un server component es soportado — verificar con `npm run build` |

## What is **not** in this spec

- Cualquier funcionalidad: buscar/filtrar, crear, editar, vincular padres, resumen del día.
- Las demás pantallas (Avisos, Mi cuenta, Login, Crear publicación, Agregar niño, Resumen del día, Vincular padre).
- Datos reales o persistencia.
- Página 404 personalizada y metadatos por ruta.
