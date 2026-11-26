# SPEC 06 — Modal "Nueva publicación" desde el sidebar

> **Status:** Aprobado
> **Depends on:** SPEC 01
> **Date:** 2026-11-25
> **Objective:** Abrir desde el botón "Nueva publicación" del sidebar un modal réplica de `references/pantallas/crear-publicacion.dc.html` con PARA multi-selección excluyente, TIPO y descripción interactivos, sin lógica de publicación ni persistencia.

## Scope

**In:**

- `features/sidebar/SidebarContent.tsx`: pasa a `"use client"`; el `<Link href="#">` de "Nueva publicación" se reemplaza por un `<button type="button">` con el mismo degradado, sombra y tipografía; un `useState` local controla `open`. No llama a `onNavigate`: el drawer móvil queda abierto detrás del modal. El resto de los links del sidebar no cambia.
- `features/sidebar/NewPostModal.tsx` (nuevo, `"use client"`): props `open` / `onClose`. Se renderiza con `createPortal` en `document.body` para escapar del `inert` del drawer (`MobileSidebar.tsx`) y del stacking `z-50`; backdrop `fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-modal-backdrop px-6 py-10`, con cierre al hacer clic fuera de la tarjeta.
- Tarjeta `w-full max-w-[580px] overflow-hidden rounded-[24px] border border-border bg-auth-page shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]`. Header con "Cancelar" (15px bold, `--color-muted-strong`), título "Nueva publicación" (Fredoka 18px semibold) y "Publicar" (15px extrabold, `--color-coral-deep`), separado por `border-b border-border` y con `px-[26px] py-5`.
- Cuerpo con `px-6 py-6 sm:px-[26px]`; labels de sección `PARA`, `TIPO`, `DESCRIPCIÓN` y `FOTOS` en 12px extrabold, `tracking-[0.7px]`, color `--color-muted-strong`, con `mb-[10px]`; cada bloque termina con `mb-[22px]`.
- PARA: chips de Mateo, Sofía y Benjamín con avatar de 26×26px, inicial en Fredoka 13px y el nombre; más el chip "Toda la sala". Chip de niño: `gap-2 rounded-full border-[1.5px] py-[6px] pr-[14px] pl-[6px] text-[14px] font-bold`; el de sala usa `px-4`. Seleccionado = borde y fondo `--color-foreground` con texto blanco; sin seleccionar = borde `--color-border`, fondo `--color-surface` y texto `--color-nav`.
- **PARA arranca sin ninguna selección** (difiere del mockup, donde Mateo aparece resaltado). Se pueden seleccionar varios niños a la vez y deseleccionarlos. "Toda la sala" es excluyente en ambos sentidos: al elegirla se remueve toda selección de niños, y al elegir un niño se desactiva "Toda la sala".
- TIPO: siete pills (`Comida`, `Siesta`, `Actividad`, `Logro`, `Ánimo`, `Foto`, `Anuncio`) con los colores exactos del mockup, `rounded-full px-4 py-2 text-[13.5px] font-extrabold` y `border-none`. Arrancan sin selección; al hacer clic, solo esa pill queda resaltada con `ring-2 ring-foreground/70 ring-offset-2 ring-offset-auth-page`. El resaltado es puramente visual.
- DESCRIPCIÓN: `<textarea>` controlado con el texto exacto del mockup como valor inicial ("Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón."), `min-h-[120px]`, `resize-y`, `rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[14px] text-[15px] leading-[1.5]`, placeholder "Contá cómo le fue hoy…". Se puede editar; no se guarda.
- FOTOS: dos tiles de 96×96px con `gap-3`, `rounded-[14px]`; el primero con `ImageIcon` centrado y el segundo con borde dashed `--color-photo-border`, `PlusIcon` en `--color-coral-strong` y texto "Agregar" 12px. Decorativos: sin input de archivo ni preview.
- Cierre: "Cancelar", "Publicar", `Escape` y clic en el backdrop cierran y resetean selección de niños, "Toda la sala", tipo y descripción a sus valores iniciales. "Publicar" no persiste ni muestra confirmación. Mientras está abierto, el scroll del fondo queda bloqueado y se restaura en el cleanup.
- Accesibilidad: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` apuntando al título; `aria-pressed` en los chips de PARA y en las pills de TIPO; `role="group"` con `aria-labelledby` para "PARA" y "TIPO"; `<label htmlFor>` para la descripción; foco inicial en el primer chip de niño (Mateo).
- `app/globals.css`: tokens nuevos para los colores que no existen en la paleta actual (Comida `#9A7B1E`, Siesta `#E7DCF6` / `#7B5FC0`, Ánimo `#F9D2DE` / `#C56486`, Foto `#FBD8CC` / `#D9684A` y avatar verde de Benjamín `#B9DEC4` / `#3E8B62`); reutilizar `--color-activity`, `--color-achievement`, `--color-achievement-soft`, `--color-announcement`, `--color-announcement-soft`, `--color-child-avatar`, `--color-child-avatar-ink`, `--color-coral-strong`, `--color-border`, `--color-auth-page`, `--color-field-border`, `--color-placeholder`, `--color-surface` y `--color-modal-backdrop`.
- No se agregan iconos: `ImageIcon` y `PlusIcon` ya están en `components/icons.tsx`. No se modifica `MobileSidebar.tsx` ni `Sidebar.tsx`.
- Verificación: `npm run build` + `npx tsc --noEmit`; capturas a 1440px y 375px comparadas con `crear-publicacion.dc.html`, incluida la prueba de exclusividad de PARA en el drawer móvil.

**Out of scope (for future specs):**

- Publicación real, `fetch`, persistencia en `lib/mockData.ts` ni actualización del feed al hacer clic en "Publicar".
- Subida, previsualización o eliminación de fotos; validación de campos ni mensajes de error.
- Pantalla de confirmación, estados de carga ni navigation a `/` después de publicar.
- Ruta propia `/crear-publicacion`, metadatos, tests unitarios/e2e.
- Cambios en las pantallas de auth, en `/kids`, en el contenido del feed ni en los links existentes del sidebar.

## Data model

No se agregan archivos ni estructuras a `lib/`. Los niños son datos en duro dentro de `NewPostModal.tsx`, con los nombres y colores del mockup:

```ts
const RECIPIENTS = [
  { id: "mateo", name: "Mateo", initial: "M", bg: "#A9D9E8", ink: "#1F7A93" },
  { id: "sofia", name: "Sofía", initial: "S", bg: "#F4B8CC", ink: "#C44A7A" },
  { id: "benjamin", name: "Benjamín", initial: "B", bg: "#B9DEC4", ink: "#3E8B62" },
] as const;
type RecipientId = (typeof RECIPIENTS)[number]["id"];

const POST_TYPES = [
  "Comida", "Siesta", "Actividad", "Logro", "Ánimo", "Foto", "Anuncio",
] as const;
type PostType = (typeof POST_TYPES)[number];

const INITIAL_DESCRIPTION =
  "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón.";
```

Estado local: `selectedChildren: RecipientId[]` (`[]`), `wholeRoom: boolean` (`false`), `selectedType: PostType | null` (`null`) y `description: string` (`INITIAL_DESCRIPTION`). Handlers: `toggleChild(id)` alterna el niño y hace `setWholeRoom(false)`; `selectWholeRoom()` hace `setSelectedChildren([])` y `setWholeRoom(true)`. El reset vuelve a los cuatro valores iniciales.

## Implementation plan

1. **Tokens.** Agregar a `app/globals.css` los colores del mockup que faltan en la paleta; verificar que no haya duplicados con los existentes. Verificar: `npx tsc --noEmit` sin errores.
2. **Estructura del modal.** Crear `features/sidebar/NewPostModal.tsx` con portal, backdrop, tarjeta, header y las cuatro secciones con el markup del mockup, aún sin estado. Verificar: render aislado con `open` coincide con `crear-publicacion.dc.html`.
3. **PARA.** Estado de selección múltiple, regla excluyente con "Toda la sala" y `aria-pressed`. Verificar manual: tres niños seleccionables, "Toda la sala" limpia la selección y un niño desactiva la sala.
4. **TIPO y descripción.** Pills con resaltado único y textarea controlada con el texto inicial. Verificar: una sola pill resaltada, texto editable sin efectos fuera del modal.
5. **Ciclo de vida e integración.** Foco inicial, `Escape`, backdrop, lock de scroll, reset y el `<button>` en `SidebarContent.tsx`. Verificar: apertura desde sidebar desktop y desde el drawer móvil, con el modal interactivo por encima del panel.
6. **Verificación final.** `npm run build` + `npx tsc --noEmit`; capturas a 1440px y 375px comparadas con el mockup; consola de Playwright sin warnings de React.

## Acceptance criteria

- [ ] `npm run build` y `npx tsc --noEmit` terminan sin errores.
- [ ] El botón "Nueva publicación" abre el modal desde `/` y desde el drawer móvil; el modal queda por encima del drawer y es interactivo.
- [ ] El modal replica textos, labels, colores, radios y espaciados de `crear-publicacion.dc.html` a 1440px y 375px, sin scroll horizontal.
- [ ] PARA arranca sin selección; se pueden seleccionar y deseleccionar varios niños a la vez.
- [ ] "Toda la sala" resalta y elimina cualquier niño seleccionado; elegir un niño desactiva "Toda la sala".
- [ ] TIPO arranca sin selección, resalta una sola pill por vez y no modifica el feed.
- [ ] La descripción arranca con el texto del mockup y se puede editar; las fotos son decorativas.
- [ ] Cancelar, Publicar, `Escape` y el clic en el backdrop cierran y resetean selección, tipo y descripción.
- [ ] El modal tiene `role="dialog"`, `aria-modal="true"`, título asociado, `aria-pressed` en PARA/TIPO y foco inicial en Mateo; el scroll del fondo se libera al cerrar.
- [ ] No hay `fetch`, persistencia, iconos nuevos ni cambios en `lib/`, en `MobileSidebar.tsx`, en las rutas de auth ni en `/kids`.

## Decisions

- **Sí:** PARA arranca sin selección (elegido por el usuario). **No:** Mateo preseleccionado como en el mockup; el mockup se usa solo como referencia visual.
- **Sí:** Cancelar y Publicar cierran y resetean sin guardar (elegido por el usuario). **No:** confirmación, navigate ni actualización del feed.
- **Sí:** Pills de TIPO y textarea interactivos, sin persistencia (elegido por el usuario). **No:** upload de fotos ni validación de campos.
- **Sí:** "Toda la sala" y los niños son mutuamente excluyentes en ambos sentidos (elegido por el usuario). **No:** selección simultánea ni opción irreversible.
- **Sí:** `createPortal` a `document.body` y `z-[60]` para el modal. **No:** renderizarlo dentro del `<aside>` del drawer, que tiene `inert` y `z-50`.
- **Sí:** Los tres niños y sus colores van en duro en el modal, con nombres de pila como en el mockup. **No:** importar `lib/children.ts`, que usa nombres completos y no incluye a Benjamín con estos colores.
- **Sí:** Tokens nuevos solo para colores ausentes de la paleta. **No:** repetir valores hexadecimales ya definidos como tokens.
- **Sí:** `SidebarContent` como client component con `useState` local. **No:** subir el estado a `Sidebar`, `MobileSidebar` ni a las páginas.

## Risks

| Risk | Mitigation |
| --- | --- |
| El drawer móvil tiene `inert={!isOpen}` y `z-50`; un modal renderizado dentro quedaría inactivo o tapado | `createPortal` a `document.body` con backdrop `z-[60]`; verificar en Playwright a 375px |
| `useEffect` con `Escape`/scroll lock deja listeners si el modal se desmonta | Limpiar listener y restaurar `overflow` en el cleanup; verificar consola |
| El mockup es una página completa, no un modal | Reutilizar la estructura de `AddChildModal` para backdrop y tarjeta; comparar con Playwright |
| Divergencia de estilos al traducir los SVGs y estilos inline a Tailwind | Copiar paths y `strokeWidth` de `ImageIcon`/`PlusIcon` existentes y tokens extraídos del HTML |

## What is **not** in this spec

- Publicación real, validación, confirmación ni estados de carga.
- Subida de fotos ni manejo real del botón "Agregar".
- Persistencia en `lib/mockData.ts` ni cambio en el feed.
- Ruta propia, metadatos ni tests automáticos.
- Cambios fuera de `features/sidebar/`, `app/globals.css` y los tokens globales.
