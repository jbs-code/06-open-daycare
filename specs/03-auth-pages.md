# SPEC 03 — Pantallas de autenticación `/auth/login` y `/auth/activate-account`

> **Status:** Aprobado
> **Depends on:** SPEC 01
> **Date:** 2026-11-18
> **Objective:** Construir `/auth/login` y `/auth/activate-account` como réplicas visuales estáticas de `references/pantallas/login.dc.html` (sin el selector de rol de las líneas 47–57) y `references/pantallas/activar-cuenta.dc.html`, con adaptación a móvil y sin funcionalidad real.

## Scope

**In:**

- Ruta `/auth/login`: panel izquierdo con degradado coral, logo "OpenDayCare", titular "El día de cada niño, compartido con su familia.", descripción y pie "🌿 Guardería Sala Soles"; panel derecho con el formulario.
- Formulario de login: "Iniciar sesión", "Ingresá para ver el día de hoy.", etiquetas `EMAIL` y `CONTRASEÑA`, email vacío con placeholder `tu@email.com`, password con placeholder `••••••••`, "¿Olvidaste tu contraseña?", CTA "Iniciar sesión" y pie "¿Te invitó la guardería? Activá tu cuenta".
- Omisión explícita de las líneas 47–57 del mockup: no se renderiza "INGRESO COMO" ni los botones Personal/Familia, y no existe estado de rol.
- Ruta `/auth/activate-account`: logo coral, "Bienvenida a OpenDayCare", texto de invitación, tarjeta con avatar "M" / "Te invitaron a seguir a" / "Mateo · Sala Soles", campos `CÓDIGO DE INVITACIÓN` (`7K4P9`), `EMAIL` (`lucia.fernandez@gmail.com`) y `CREAR CONTRASEÑA` (`contraseña`, enmascarado), aviso de autorización con checkbox marcado, CTA "Activar mi cuenta" y pie "¿Ya tenés cuenta? Iniciar sesión".
- Todos los CTA y links secundarios apuntan a `#` (decidido con el usuario), sin rutas 404.
- Tokens nuevos en `app/globals.css` para el fondo `#FBF4EC`, borde de campos y colores del aviso de autorización; se reutilizan los tokens coral existentes y las fuentes de `app/layout.tsx`.
- Responsive: bajo `lg` (1024px) el panel coral se apila sobre el formulario en login; en activate-account el contenido se mantiene centrado con padding reducido. Sin scroll horizontal a 375px.

**Out of scope (for future specs):**

- Autenticación real: login, activación, validación, envío de formularios, sesión, persistencia o llamadas a red.
- Selector de rol y los valores de email dependientes del rol (`caro@opendaycare.com` / `lucia.fernandez@gmail.com`).
- Navegación entre ambas pantallas de `/auth` ni desde el feed/sidebar hacia `/auth`: todos los enlaces son `#`.
- Las rutas `feed.dc.html` y `familia-feed.dc.html` que usaba el mockup como destino de los CTA.
- Modo oscuro, metadatos por ruta, página 404 personalizada y cambios en `app/layout.tsx`.

## Data model

No se introducen estructuras de datos ni archivos nuevos en `lib/`. Los textos y valores precargados son literales en los componentes, porque no se repiten entre pantallas.

Los campos precargados se escriben con `defaultValue` y el checkbox con `defaultChecked` para mantener los inputs no controlados y evitar warnings de React por campos controlados sin handler.

## Implementation plan

1. **Tokens en `app/globals.css`.** Agregar `--color-auth-page: #fbf4ec`, `--color-field-border: #eadfd0`, `--color-placeholder: #b6a99b` y los del aviso (`--color-consent-bg: #fbf1d6`, `--color-consent-ink: #8a7234`, `--color-consent-check: #5fb97e`). Verificar: `npm run dev` muestra el fondo crema correcto.
2. **Icono en `components/icons.tsx`.** Agregar `CheckIcon` con el `polyline` del mockup; reutilizar el `SunIcon` existente para el logo. Verificar: `npx tsc --noEmit` sin errores.
3. **`features/auth/LoginBrandPanel.tsx`.** Panel coral con dos círculos decorativos, logo, titular, descripción y pie, usando `SunIcon`. Verificar: componente aislado con los textos exactos del mockup.
4. **`features/auth/LoginForm.tsx`.** Título, subtítulo, labels, inputs con `defaultValue`/placeholder, "¿Olvidaste tu contraseña?" como elemento inerte, CTA y pie con enlace `#`. Verificar: render aislado sin estado ni handlers.
5. **`app/auth/login/page.tsx`.** Componer panel + formulario en `lg:grid-cols-[1.05fr_1fr]`, apilados por debajo de `lg`. Verificar: `/auth/login` carga sin sidebar y sin el bloque "INGRESO COMO".
6. **`features/auth/ActivationInviteCard.tsx` y `features/auth/ActivationForm.tsx`.** Tarjeta de invitación y formulario completo con `defaultValue` en los tres campos y checkbox `defaultChecked`. Verificar: render aislado con los valores literales del mockup.
7. **`app/auth/activate-account/page.tsx`.** Centrar el formulario con `max-w-[440px]`, fondo `bg-auth-page` y padding adaptado. Verificar: `/auth/activate-account` carga sin 404 y sin sidebar.
8. **Ajuste responsive final.** Reducir paddings del panel coral y del contenedor en móvil, y revisar contraste/alineación a 375px y 1440px contra ambos mockups con Playwright.

## Acceptance criteria

- [ ] `npm run build` y `npx tsc --noEmit` terminan sin errores.
- [ ] `/auth/login` y `/auth/activate-account` cargan sin 404 y no muestran la sidebar del feed.
- [ ] `/auth/login` replica el mockup en desktop: panel coral con degradado, logo, titular, descripción, "🌿 Guardería Sala Soles", título "Iniciar sesión", subtítulo, labels `EMAIL`/`CONTRASEÑA`, placeholder de password `••••••••`, CTA gradiente y pie "¿Te invitó la guardería? Activá tu cuenta".
- [ ] El input email de `/auth/login` aparece vacío con placeholder `tu@email.com`.
- [ ] No existen en el DOM el label "INGRESO COMO" ni los botones "Personal"/"Familia" (omitidos según el pedido).
- [ ] `/auth/activate-account` replica el mockup en desktop: "Bienvenida a OpenDayCare", texto de invitación, tarjeta con "M" / "Te invitaron a seguir a" / "Mateo · Sala Soles", código `7K4P9`, email `lucia.fernandez@gmail.com`, password enmascarado con valor `contraseña`, CTA "Activar mi cuenta" y pie "¿Ya tenés cuenta? Iniciar sesión".
- [ ] El checkbox de autorización aparece marcado y con el texto exacto del mockup.
- [ ] Todos los `<a>` de ambas pantallas tienen `href="#"` y no hay handlers de navegación ni de envío.
- [ ] No hay `useState`, `onSubmit`, `fetch` ni peticiones de red en `features/auth/` ni en las rutas `/auth`.
- [ ] No hay `<link>` manual a Google Fonts: Fredoka y Nunito siguen cargándose desde `app/layout.tsx`.
- [ ] A 375px no hay scroll horizontal: en login el panel coral va arriba del formulario y en activate-account el contenido queda centrado.

## Decisions

- **Yes:** Omitir las líneas 47–57 del mockup de login (pedido explícito). Con eso desaparecen el selector de rol, `pickStaff`/`pickParent`, `loginHref` y los colores por rol.
- **Yes:** Email del login vacío con placeholder `tu@email.com` (elegido por el usuario). **No:** precargar `caro@opendaycare.com` ni `lucia.fernandez@gmail.com`.
- **Yes:** Todos los enlaces a `#` (elegido por el usuario). **No:** enlaces cruzados entre login y activate-account ni CTA hacia `/`.
- **Yes:** Rutas explícitas `/auth/login` y `/auth/activate-account`, en inglés (corrección del usuario). **No:** login en `/auth`, redirect desde `/auth` ni rutas en español.
- **Yes:** Réplica estática con `defaultValue`/`defaultChecked`. **No:** estado local ni validación, consistente con SPEC 01 y SPEC 02.
- **Yes:** Dos rutas planas, sin `app/auth/layout.tsx`: el layout raíz no incluye sidebar. **No:** route group `(auth)`.
- **Yes:** `CheckIcon` en `components/icons.tsx` y reuso de `SunIcon`. **No:** SVG inline duplicados en los componentes.
- **Yes:** Breakpoint `lg` para apilar el login. **No:** `md`, donde las dos columnas quedarían demasiado angostas.

## Risks

| Risk | Mitigation |
| --- | --- |
| El fondo global de `body` es `#F6ECDF` (SPEC 01) y puede filtrarse en las rutas `/auth` | Ambas páginas fijan `bg-auth-page` en su contenedor `min-h-screen`; verificar a 375px y 1440px |
| Inputs controlados sin `onChange` generan warnings y congelan el campo | Usar `defaultValue` y `defaultChecked`; verificar consola de Playwright sin warnings de React |

## What is **not** in this spec

- Login, activación, validación ni envío de formularios.
- Selector de rol, emails por rol ni lógica derivada del mismo.
- Navegación entre pantallas de `/auth` ni desde el feed/sidebar.
- Datos reales, persistencia ni sesión.
- Metadatos por ruta, 404 personalizada ni modo oscuro.
