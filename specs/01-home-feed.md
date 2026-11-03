# SPEC 01 — Home `/` (Feed) con data ficticia

> **Status:** Aprobado
> **Depends on:** —
> **Date:** 2026-11-02
> **Objective:** Construir el home `/` como réplica visual del mockup `references/pantallas/feed.dc.html` usando Tailwind CSS, data ficticia y sin funcionalidad real.

## Scope

**In:**

- Layout del home: sidebar fija (desktop) + columna central de max-width 760px.
- Sidebar: logo "OpenDayCare / Sala Soles", botón "Nueva publicación", nav con item "Feed" activo (Niños, Avisos, Mi cuenta), bloque de usuario "Caro Giménez" con botón de logout.
- Contenido del feed: encabezado ("Buenas, Caro"), tarjeta "Compartí un momento…", label "PUBLICADO HOY" y 3 posts de ejemplo (logro, actividad con foto, anuncio).
- Tipografías Fredoka + Nunito cargadas con `next/font/google`.
- Paleta del mockup (`#F6ECDF`, `#FFFDF9`, `#ECE0D0`, acentos) definida en `app/globals.css` vía Tailwind CSS 4 (`@theme`).
- Responsive: bajo `md` (768px) la sidebar se oculta y un botón hamburguesa en una barra superior abre un drawer superpuesto (overlay + panel deslizante), que cierra al tocar el overlay o un link.
- Data ficticia en `lib/mockData.ts`.

**Out of scope (for future specs):**

- Cualquier funcionalidad: crear/editar publicación, likes, comentarios, navegación real entre pantallas.
- Pantallas Niños, Avisos, Mi cuenta, Login, Crear publicación, Detalle, Foto (existentes solo como mockups).
- Autenticación y datos reales (API, base de datos).
- Modo oscuro.

## Data model

```ts
// lib/mockData.ts
export type PostKind = "achievement" | "activity" | "announcement";

export interface FeedPost {
  id: string;
  kind: PostKind;
  authorName: string;        // "Mateo" | "Anuncio general"
  authorInitial: string;     // "M" (vacío para anuncio → usa ícono)
  time: string;              // "14:20 · publicado por vos"
  audience: string;          // "Para: familia de Mateo"
  body: string;
  photo?: { label: string }; // placeholder visual, sin imagen real
  likes: number;
  comments: number;
}

export interface CurrentUser {
  fullName: string;          // "Caro Giménez"
  initial: string;           // "C"
  role: string;              // "Maestra · Soles"
  roomName: string;          // "Sala Soles"
  childrenCount: number;     // 12
}

export const currentUser: CurrentUser;
export const feedPosts: FeedPost[]; // 3 posts del mockup
export const feedDateLabel: string; // "martes 17 jun"
```

Mapeo `PostKind` → UI en español (etiqueta del badge y colores):

| `PostKind` (`PostKind` en inglés) | Label en UI | Badge |
| --- | --- | --- |
| `"achievement"` | `LOGRO` | verde (`#CFEBD8` / `#3E9B6C`) |
| `"activity"` | `ACTIVIDAD` | celeste (`#C7E7F1` / `#2E89A6`) |
| `"announcement"` | `ANUNCIO` | azul (`#CCD8F4` / `#4E72C8`) |

El mapeo vive en un diccionario constante en `lib/` (p. ej. `POST_KIND_LABELS: Record<PostKind, string>`), no inline en los componentes.

## Implementation plan

1. **Tokens y base en `app/globals.css`.** Reemplazar el scaffold por: fondo `#F6ECDF`, color de texto `#3F362E`, `@theme` con la paleta del mockup (superficies, bordes, acentos coral/verde/celeste/azul) y fuentes `--font-fredoka` / `--font-nunito`. Verificar: `npm run dev` muestra la página con la nueva paleta.
2. **Fonts en `app/layout.tsx`.** Cargar Fredoka (400–700) y Nunito (400–800) con `next/font/google`, aplicar Nunito como `font-sans` en `<body>`. Verificar: `npx tsc --noEmit` sin errores.
3. **Data ficticia en `lib/mockData.ts`.** Escribir `CurrentUser`, `FeedPost[]` (los 3 posts textuales del mockup) y `feedDateLabel`. Verificar: compila sin errores.
4. **`features/feed/PostCard.tsx`.** Tarjeta con header (avatar/ícono, nombre, hora, badge según `kind`), `audience`, `body`, placeholder de foto opcional y footer (likes, comentarios, "Editar"). Verificar: se ve en `/` cuando se importa puntualmente en `page.tsx`.
5. **`features/feed/` resto:** `ComposerCard.tsx` ("Compartí un momento…"), `FeedHeader.tsx` (eyebrow + saludo + subtítulo), `SectionLabel.tsx` ("PUBLICADO HOY" con línea). Verificar: `page.tsx` los compone y el feed luce completo en desktop.
6. **`features/sidebar/Sidebar.tsx`.** Versión desktop (248px, sticky): logo, botón "Nueva publicación", nav (Feed activo), usuario + logout. Links con `href="#"` donde la pantalla no existe. Verificar: visualmente igual al mockup en desktop.
7. **Responsive en `features/sidebar/`:** barra superior con hamburguesa (visible solo bajo `md`) + drawer con overlay y cierre por overlay/link. Verificar a 375px con Playwright: hamburger abre y cierra el drawer.
8. **Verificación final:** `npm run build` + `npx tsc --noEmit` sin errores; comparación lado a lado con Playwright entre `references/pantallas/feed.dc.html` y `/`.

## Acceptance criteria

- [ ] `npm run build` y `npx tsc --noEmit` terminan sin errores.
- [ ] En desktop (≥768px) `/` muestra sidebar de 248px + columna central ≤760px, igual al mockup (colores, tipografía, radios, sombras, badges).
- [ ] Los 3 posts aparecen con sus textos, badges y contadores exactos del mockup.
- [ ] Fredoka y Nunito se cargan vía `next/font/google` (sin `<link>` manual).
- [ ] A 375px no hay scroll horizontal; la sidebar está oculta y se ve el botón hamburguesa.
- [ ] Tocar hamburguesa abre el drawer con overlay; tocar el overlay o un link lo cierra.
- [ ] El item "Feed" aparece resaltado; los demás links no navegan a 404.
- [ ] No hay llamadas a red ni lógica de estado: solo render estático con data de `lib/mockData.ts`.

## Decisions

- **Yes:** Screaming Architecture (`features/sidebar/`, `features/feed/`, `lib/`). Los directorios nombran el dominio; reutilizable en las próximas pantallas.
- **No:** Todo en `app/page.tsx`. Se volvería inmantenible al agregar Niños/Avisos.
- **Yes:** `next/font/google` para las fuentes. Optimizado por Next, sin flash de carga.
- **No:** `<link>` de Google Fonts como el mockup. Dependencia externa en runtime.
- **Yes:** Links rotos como `href="#"`. Evita 404 mientras las pantallas no existen.
- **No:** Crear rutas vacías solo para que los links funcionen. Sería inventar pantallas fuera del alcance.
- **Yes:** Drawer superpuesto con overlay en móvil (patrón estándar). Consistente con el futuro layout compartido.
- **No:** Responsive por breakpoints propios en CSS crudo. Tailwind `md:` cubre el caso con una sola utility class.
- **Yes:** Placeholder de foto (recuadro punteado) en vez de imagen real. El mockup hace exactamente eso; no hay assets.
- **No:** Estado de "me gusta" interactivo. Toda funcionalidad queda para specs futuros.

## Risks

| Risk | Mitigation |
| --- | --- |
| Tailwind 4 (`@theme`) mal configurado rompe los colores del mockup | Paso 1 dedicado a tokens, verificado con `npm run dev` antes de construir componentes |
| `next/font` con pesos de Fredoka/Nunito no disponibles | Usar solo los pesos que el mockup usa (Fredoka 400–700, Nunito 400–800) |
| Drawer móvil tapa contenido o deja scroll bloqueado | Cerrar en overlay y en click de link; verificar a 375px con Playwright |

## What is **not** in this spec

- Cualquier funcionalidad (crear, editar, likes, comentarios, navegación real).
- Las demás pantallas del sistema (Niños, Avisos, Mi cuenta, Login, Crear publicación, Detalle, Foto).
- Datos reales o persistencia.
- Modo oscuro.
