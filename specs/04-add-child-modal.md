# SPEC 04 — Modal "Agregar niño" en `/kids`

> **Status:** Aprobado
> **Depends on:** SPEC 02
> **Date:** 2026-11-20
> **Objective:** Abrir desde `/kids` un modal réplica de `references/pantallas/agregar-nino.dc.html` con validación de nombre, fecha de nacimiento y sala, que al guardar se cierra y limpia sin persistir datos.

## Scope

**In:**

- `features/kids/KidsHeader.tsx`: el enlace "Agregar niño" pasa a ser un `<button>` client con el mismo estilo; hace `setOpen(true)`.
- `features/kids/AddChildModal.tsx`: client component con backdrop oscuro semitransparente y tarjeta centrada `max-w-[520px]`, réplica del mockup: header con "Cancelar" / "Agregar niño" / "Guardar", labels `NOMBRE COMPLETO`, `FECHA DE NACIMIENTO`, `SALA`, `ALERGIAS (ETIQUETAS)` y `NOTAS MÉDICAS`, con placeholders y paddings exactos.
- Campo SALA como `<select>` estilizado con `Soles`, `Lunas` y `Estrellas`; valor inicial `Soles` y chevron abajo (`ChevronDownIcon` nuevo en `components/icons.tsx`).
- Campos: nombre y fecha como texto (`dd/mm/aaaa`), alergias como texto, notas como `<textarea>` de altura mínima 90px.
- Validación de los tres obligatorios al perder foco (`blur`) y al hacer clic en "Guardar". Fecha válida: formato `dd/mm/aaaa`, mes 1–12, día según mes y año bisiesto; **se permiten fechas futuras**.
- Error por campo: borde coral + mensaje debajo; se limpia al corregir. Al guardar con errores se enfoca el primer campo inválido y el modal no cierra.
- Guardar válido: cierra el modal y limpia los cinco campos. La grilla de `/kids` sigue con los 8 niños de `lib/children.ts`.
- Cancelar, `Escape` y clic en el backdrop cierran y limpian; el scroll del fondo queda bloqueado mientras el modal está abierto.
- Accesibilidad: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` apuntando al título, `<label>` asociado a cada campo y foco inicial en nombre.
- Un token nuevo en `app/globals.css` para el backdrop; el resto reutiliza `--color-auth-page`, `--color-field-border`, `--color-border`, `--color-muted-strong`, `--color-coral-deep` y `--color-page`.
- Responsive: tarjeta centrada con padding 24px a 375px, sin scroll horizontal.

**Out of scope (for future specs):**

- Persistencia, alta real en `lib/children.ts`, actualización de la grilla ni navegación al perfil del niño creado.
- Edición ("Editar"), vincular padres y resumen del día.
- Validación de alergias y notas médicas (ambos opcionales).
- Ruta `/kids/agregar-nino`, metadatos, tests unitarios/e2e.
- Cambios en `/kids/[slug]`, en el sidebar ni en las pantallas de auth.

## Data model

No se agregan archivos ni estructuras a `lib/`. Estado local dentro de `AddChildModal.tsx`:

```ts
const ROOM_OPTIONS = ["Soles", "Lunas", "Estrellas"] as const;
type Room = (typeof ROOM_OPTIONS)[number];

interface AddChildForm {
  fullName: string;
  birthDate: string;
  room: Room | "";
  allergies: string;
  medicalNotes: string;
}

type RequiredField = "fullName" | "birthDate" | "room";
type FieldErrors = Partial<Record<RequiredField, string>>;
```

Helper local `isValidDate(value: string): boolean`: regex `^(\d{2})/(\d{2})/(\d{4})$`, mes entre 1 y 12, día entre 1 y los días del mes, con regla de bisiesto. Sin límite superior de fecha.

## Implementation plan

1. **Tokens e icono.** `ChevronDownIcon` en `components/icons.tsx` (path `m6 9 6 6 6-6`, stroke `currentColor`) y token `--color-modal-backdrop` en `app/globals.css`. Verificar: `npx tsc --noEmit` sin errores.
2. **Estructura del modal.** `features/kids/AddChildModal.tsx` con props `open` / `onClose`, markup completo del mockup y backdrop; sin lógica de validación aún. Verificar: render aislado con `open` coincide con `agregar-nino.dc.html`.
3. **Ciclo de vida.** `useEffect` para `Escape`, clic en backdrop, bloqueo de scroll y foco inicial, con cleanup. Verificar: consola de Playwright sin warnings de React.
4. **Validación.** Estado del form, `errors`, validación en `blur` y en `Guardar`, borde coral, mensajes y foco al primer inválido. Verificar manual: submit vacío marca nombre y fecha (SALA arranca en `Soles`); `31/02/2024` falla; `29/02/2024` y `15/06/2027` pasan.
5. **Integración.** `KidsHeader.tsx` pasa a `"use client"` con `useState`; `app/kids/page.tsx` queda intacto como server component. Guardar válido y Cancelar cierran y limpian. Verificar: clic en "Agregar niño" abre el modal y la grilla no se modifica.
6. **Verificación final.** `npm run build` + `npx tsc --noEmit`; capturas a 1440px y 375px comparadas con el mockup.

## Acceptance criteria

- [x] `npm run build` y `npx tsc --noEmit` terminan sin errores.
- [x] El botón "Agregar niño" abre el modal sobre `/kids` con backdrop oscuro y la tarjeta centrada.
- [x] El modal replica los textos, labels, placeholders, colores y espaciados de `agregar-nino.dc.html`.
- [x] SALA es un `<select>` con `Soles` / `Lunas` / `Estrellas`, arranca en `Soles` y muestra chevron abajo.
- [x] Guardar con nombre y fecha vacíos marca ambos con borde coral y mensaje, enfoca "Nombre completo" y no cierra el modal; SALA arranca en `Soles` (sin opción vacía) y por eso no genera error.
- [x] `31/02/2024` y `29/02/2023` se rechazan; `29/02/2024`, `15/06/2027` y `01/01/2000` se aceptan.
- [x] Cada error se limpia al corregir su campo, y la validación también corre al perder foco.
- [x] Guardar con datos válidos cierra el modal, limpia los cinco campos y deja la grilla en 8 niños.
- [x] Cancelar, `Escape` y clic en el backdrop cierran y limpian; el scroll de fondo se libera al cerrar.
- [x] Al abrir, el foco queda en "Nombre completo"; el modal tiene `role="dialog"`, `aria-modal="true"` y título asociado.
- [x] A 375px no hay scroll horizontal y la tarjeta conserva su padding.
- [x] No hay `fetch`, cambios en `lib/children.ts` ni modificación de otras rutas.

## Decisions

- **Sí:** Guardar cierra y limpia sin tocar la grilla (elegido). Mantiene el perfil estático de SPEC 01–03. **No:** alta en memoria ni estado en `app/kids/page.tsx`.
- **Sí:** Select con `Soles` / `Lunas` / `Estrellas` (elegido). Da sentido real a la obligatoriedad de sala. **No:** texto fijo "Soles" ni select de una sola opción. Al no incluir opción vacía, la validación de SALA es defensiva y no se dispara desde la UI.
- **Sí:** Fecha como texto `dd/mm/aaaa` con validación de calendario (elegido). Conserva el placeholder del mockup. **No:** `type="date"`, que cambia el render.
- **Sí:** Fechas futuras válidas (elegido). **No:** comparar contra `Date.now()`.
- **Sí:** Validar en `blur` y en Guardar (elegido). **No:** solo al guardar.
- **Sí:** Backdrop oscuro con cierre por Cancelar, `Escape` y clic fuera (elegido). **No:** tarjeta sin backdrop.
- **Sí:** `AddChildModal.tsx` como client component con estado local; `KidsHeader` client solo para el `useState`; `page.tsx` sigue server. **No:** convertir la página en client ni propagar callbacks desde ella.
- **Sí:** "Cancelar" y "Guardar" como `<button>`. **No:** `<a href="#">`, que no cierra el modal.

## Risks

| Risk | Mitigation |
| --- | --- |
| `useEffect` con `Escape`/scroll lock deja listeners si el modal se desmonta | Limpiar listener y restaurar `overflow` en el cleanup; verificar consola |
| Cliente dentro de `page.tsx` server en Next 16 | Importar el client component desde el header; verificar con `npm run build` |
| Divergencia visual respecto al mockup | Tokens extraídos del HTML + comparación con Playwright a 1440px y 375px |

## What is **not** in this spec

- Guardado real, persistencia ni actualización de la lista de niños.
- Edición, vinculación de padres ni resumen del día.
- Validación de campos opcionales (alergias y notas).
- Ruta propia para el formulario ni cambios fuera de `features/kids/` y los tokens globales.
