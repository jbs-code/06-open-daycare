# AGENTS.md

Small Next.js 16 (App Router) app: "OpenDayCare" — a daycare management UI (staff + family feeds, children, rooms, notices). Fresh `create-next-app` scaffold; real screens are not implemented yet.

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (01-app, 02-pages, 03-architecture) before writing any code. Heed deprecation notices.

The block below is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Do not remove it; commit it with your work to keep the tree clean.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- Dev server: `npm run dev` (Turbopack). Build check: `npm run build`. Lint: `npm run lint`.
- No test or typecheck script exists. Typecheck with `npx tsc --noEmit`.
- Package manager: npm (lockfile is `package-lock.json`).

## Toolchain quirks

- Next config enables `cacheComponents`, `partialPrefetching`, and `experimental.agentFeedback` — this is a Next 16 codebase; consult the bundled docs, not memory.
- Tailwind CSS 4 is loaded via the `@tailwindcss/turbopack` loader rule in `next.config.ts`, not a PostCSS plugin. There is no `tailwind.config.*`; theme lives in `app/globals.css`.
- Path alias `@/*` maps to the repo root.
- Global `LayoutProps<"/">` and typed routes come from Next-generated types (`.next/types`).

## Design references (source of truth for UI)

- `references/pantallas/*.dc.html` — interactive mockups of every screen (login, feed, ninos, avisos, etc.) built on a custom `x-dc` runtime. Open them in a browser to see intended behavior and states.
- `references/screenshots/*.png` — captured mockup states.
- `references/pantallas/support.js` is **generated — never edit it** (its header names a `dc-runtime` rebuild step that is not in this repo).
- Mockup UI copy is Spanish (rioplatense: "Ingresá", "Publicá"); fonts are Fredoka + Nunito with a warm palette (#FBF4EC, #EC7E62). Keep UI text Spanish, code identifiers English.
- Playwright MCP is configured (`opencode.json`) — use it to view mockups and verify implemented screens against them.

## Spec workflow (installed skills)

Two skills are installed from `klerith/fernando-skills` (`.agents/skills/`, hashes pinned in `skills-lock.json`):

- `/spec <feature>` — writes a draft spec to `specs/NN-slug.md` (creates `specs/` and `specs/.spec-config.yml` on first use). Never writes code.
- `/spec-impl <NN-slug>` — implements only specs whose state means "Approved"; auto-creates branch `spec-NN-slug` (unless `AutoCreateBranch: false`); implements plan steps one at a time, pausing for diff review; never commits automatically.

Honor this flow for non-trivial features: spec first, then implement stepwise on the spec branch.

## Other MCPs
- Context7 for seeking up-to-date documentation.