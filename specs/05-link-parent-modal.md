# SPEC 05 — Modal "Vincular padre" en `/kids/[slug]`

> **Status:** Aprobado
> **Depends on:** SPEC 02
> **Date:** 2026-11-25
> **Objective:** Abrir desde `ParentsCard` en `/kids/[slug]` un modal réplica de `references/pantallas/vincular-padre.dc.html` con nombre, email y parentesco interactivos, validación exclusiva del email y cierre con limpieza sin persistencia.

## Scope

**In:**

- `features/kids/ParentsCard.tsx`: pasa a `"use client"`; "Vincular otro padre" deja de ser un `<Link href="#">` y es un `<button type="button">` con el mismo estilo que hace `setOpen(true)`.
- `ParentsCard` recibe una prop nueva `childName: string` para el subtítulo "a {childName}" del modal. En Mateo se ve "a Mateo Fernández", igual que el mockup.
- `app/kids/[slug]/page.tsx`: pasa `childName={child.fullName}` a `ParentsCard`. Sigue siendo server component; el resto de la página no cambia.
- `features/kids/LinkParentModal.tsx` (nuevo, `"use client"`): props `open`, `onClose` y `childName`. Backdrop oscuro con tarjeta centrada `max-w-[480px]`, alineada arriba (`items-start`, padding `40px 24px`).
- Réplica del mockup: header con "Vincular padre" (Fredoka 18px) + "a {childName}" (13px `--color-muted`) y botón X de cierre (34×34px, radio 10px); banner azul informativo; labels `NOMBRE DEL PADRE/MADRE`, `EMAIL` y `PARENTESCO`; bloque ámbar con `CÓDIGO DE INVITACIÓN`, `7K4P9` y "Vence en 7 días"; botón degradado "Enviar invitación" con icono de enviar.
- Campos interactivos: `fullName` como texto con placeholder `Ej. Diego Fernández`, `email` como `type="email"` con placeholder `correo@ejemplo.com`, y `relation` con pills `Mamá` / `Papá` / `Tutor/a`. El estado inicial es nombre vacío, email vacío y `Mamá` seleccionada. Al hacer clic en otra pill cambia el resaltado; no guarda ni persiste nada.
- Validación **solo del email**: obligatorio y con formato válido, tanto al perder foco (`blur`) como al hacer clic en "Enviar invitación". Error = borde coral + mensaje debajo; se limpia al corregir. Con error, el modal no cierra y enfoca el email.
- "Enviar invitación" con email válido cierra el modal y limpia los tres campos, devolviendo el parentesco a `Mamá`.
- Cierre también por el botón X, `Escape` y clic en el backdrop. Mientras está abierto, el scroll del fondo queda bloqueado y se restaura al cerrar.
- Accesibilidad: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` apuntando al título, `<label>` asociado a cada campo, `aria-pressed` en las pills y foco inicial en "Nombre del padre/madre".
- Iconos nuevos en `components/icons.tsx`: `CloseIcon`, `InfoIcon` y `SendIcon`, con los trazos y `strokeWidth` de los SVG del mockup.
- Tokens nuevos en `app/globals.css` para el banner (`#E3ECFB` / `#3F5694`) y el bloque de código (`#E6D08A` / `#A88526`); el resto reutiliza `--color-modal-backdrop`, `--color-auth-page`, `--color-border`, `--color-border-soft`, `--color-field-border`, `--color-muted-strong`, `--color-nav`, `--color-announcement`, `--color-announcement-soft`, `--color-consent-bg`, `--color-consent-ink`, `--color-placeholder`, `--color-coral-from` y `--color-coral-to`.
- Responsive: a 375px el modal conserva padding de 24px y no genera scroll horizontal.

**Out of scope (for future specs):**

- Envío real de correos, `fetch`, persistencia en `lib/children.ts` ni actualización de la tarjeta de padres con un nuevo `PENDIENTE`.
- Generación, expiración real ni copia al portapapeles del código `7K4P9`.
- Validación de nombre y parentesco (no son obligatorios para esta spec).
- Pantalla de confirmación "Invitación enviada" ni estados de carga o error de red.
- Ruta propia `/kids/[slug]/vincular-padre`, metadatos, 404 personalizado ni tests unitarios/e2e.
- Cambios en `app/kids/page.tsx`, en las pantallas de auth ni en el sidebar.

## Data model

No se agregan archivos ni estructuras a `lib/`. Estado local dentro de `LinkParentModal.tsx`:

```ts
const PARENT_RELATIONS = ["Mamá", "Papá", "Tutor/a"] as const;
type ParentRelation = (typeof PARENT_RELATIONS)[number];

interface LinkParentForm {
  fullName: string;
  email: string;
  relation: ParentRelation;
}

type FieldErrors = Partial<Record<"email", string>>;
```

Estado inicial: `{ fullName: "", email: "", relation: "Mamá" }`.

Helper local `isValidEmail(value: string): boolean` con `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. Mensajes: `"Ingresá el correo electrónico."` si está vacío y `"Ingresá un correo válido."` si no coincide con el formato.

## Implementation plan

1. **Iconos y tokens.** Agregar `CloseIcon`, `InfoIcon` y `SendIcon` a `components/icons.tsx` y los cuatro tokens del mockup a `app/globals.css`. Verificar: `npx tsc --noEmit` sin errores.
2. **Estructura del modal.** Crear `features/kids/LinkParentModal.tsx` con props `open` / `onClose` / `childName` y el markup completo del mockup, sin estado ni validación aún. Verificar: render aislado con `open` coincide con `vincular-padre.dc.html`.
3. **Ciclo de vida.** `useEffect` para foco inicial en nombre, `Escape`, clic en backdrop y bloqueo de scroll, con cleanup que restaura el `overflow` anterior. Verificar: consola de Playwright sin warnings de React.
4. **Estado y validación.** Estado del form, `errors`, campos controlados, pills con resaltado y validación del email en `blur` y en "Enviar invitación". Verificar manual: email vacío y `correo@invalido` marcan error; `ana@ejemplo.com` pasa; el error se limpia al corregir.
5. **Integración.** `ParentsCard.tsx` pasa a client con `useState`, el botón abre el modal y `app/kids/[slug]/page.tsx` pasa `childName`. Verificar: en `/kids/mateo-fernandez` el subtítulo dice "a Mateo Fernández" y en `/kids/sofia-mendez` dice "a Sofía Méndez"; la página sigue siendo server component.
6. **Cierre y limpieza.** Conectar X, `Escape`, backdrop y envío válido a `closeAndReset`, que devuelve nombre y email a `""` y parentesco a `Mamá`. Verificar: al volver a abrir, el modal arranca limpio y el scroll del fondo se libera.
7. **Verificación final.** `npm run build` + `npx tsc --noEmit`; capturas a 1440px y 375px comparadas con `vincular-padre.dc.html`.

## Acceptance criteria

- [ ] `npm run build` y `npx tsc --noEmit` terminan sin errores.
- [ ] El botón "Vincular otro padre" abre el modal sobre `/kids/[slug]` con backdrop oscuro y tarjeta centrada de `max-w-[480px]`.
- [ ] El modal replica textos, labels, placeholders, colores, radios y espaciados de `vincular-padre.dc.html`, incluido el banner azul y el código `7K4P9`.
- [ ] El subtítulo muestra `a {child.fullName}`: "a Mateo Fernández" en Mateo y "a Sofía Méndez" en Sofía.
- [ ] Nombre y email se pueden escribir; las pills `Mamá` / `Papá` / `Tutor/a` cambian el resaltado al hacer clic y arrancan en `Mamá`.
- [ ] Email vacío o sin formato válido marca borde coral y mensaje al perder foco y al hacer clic en "Enviar invitación"; enfoca el email y no cierra el modal.
- [ ] El error del email se limpia al corregirlo; nombre y parentesco nunca muestran error.
- [ ] "Enviar invitación" con `ana@ejemplo.com` cierra el modal y limpia nombre, email y parentesco; al reabrir todo vuelve a cero.
- [ ] El botón X, `Escape` y el clic en el backdrop cierran el modal y liberan el scroll del fondo.
- [ ] Al abrir, el foco queda en "Nombre del padre/madre"; el modal tiene `role="dialog"`, `aria-modal="true"`, título asociado y labels vinculados a sus inputs.
- [ ] A 375px no hay scroll horizontal y la tarjeta conserva su padding de 24px.
- [ ] No hay `fetch`, persistencia, código generado ni cambios en la lista de padres de `lib/children.ts`.

## Decisions

- **Sí:** "Enviar invitación" con email válido cierra y limpia (elegido por el usuario). Igual ciclo que SPEC 04, sin persistir nada. **No:** pantalla de confirmación ni estado de envío.
- **Sí:** Nombre, email y parentesco interactivos (elegido por el usuario). **No:** campos puramente decorativos; el parentesco cambia de resaltado pero no se guarda.
- **Sí:** Subtítulo dinámico con `child.fullName` pasado desde `app/kids/[slug]/page.tsx` (elegido por el usuario). **No:** texto fijo "a Mateo Fernández" en los ocho perfiles.
- **Sí:** Cierre por X, `Escape` y backdrop con lock de scroll (elegido por el usuario). **No:** cierre únicamente por X, como hacía el `<a>` del mockup.
- **Sí:** Validar únicamente el email (decisión derivada de "únicamente la de agregar un email válido"). **No:** exigir nombre ni parentesco, que arrancan vacío y `Mamá` respectivamente.
- **Sí:** Código `7K4P9` y "Vence en 7 días" como texto fijo del mockup. **No:** generador aleatorio ni temporizador.
- **Sí:** `ParentsCard` como client component con `useState` local y `LinkParentModal` client. **No:** convertir `app/kids/[slug]/page.tsx` en client ni subir el estado a la página.
- **Sí:** `<button type="button">` para "Vincular otro padre" y para "Enviar invitación". **No:** `<a href="#">`, que no puede abrir/cerrar el modal.
- **Sí:** Iconos y tokens nuevos para las partes que no existen en la paleta actual. **No:** valores arbitrarios repetidos para banner y bloque ámbar.

## Risks

| Risk | Mitigation |
| --- | --- |
| `useEffect` con `Escape`/scroll lock deja listeners si el modal se desmonta | Limpiar listener y restaurar `overflow` en el cleanup; verificar consola |
| Cliente dentro de la página server en Next 16 | Importar el client component desde `ParentsCard`; verificar con `npm run build` |
| El mockup es una página completa, no un modal | Reutilizar la estructura de `AddChildModal` para backdrop y tarjeta; comparar con Playwright a 1440px y 375px |
| Divergencia de estilos al traducir SVGs inline a componentes | Copiar `path` y `strokeWidth` literales del HTML en `components/icons.tsx` |

## What is **not** in this spec

- Envío real, persistencia ni actualización de `lib/children.ts`.
- Validación de nombre y parentesco, ni regeneración del código de invitación.
- Confirmación visual, estados de carga o manejo de errores de red.
- Ruta propia para el formulario, metadatos ni tests automáticos.
- Cambios fuera de `features/kids/`, `components/icons.tsx`, `app/globals.css` y el `childName` en `app/kids/[slug]/page.tsx`.
