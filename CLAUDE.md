# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Always Do First

- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Project

A Steam storefront clone — two separate apps sharing a common monorepo.

## Monorepo Structure

**Tooling:** pnpm workspaces + Turborepo

```
steam-clone/
├── apps/
│   ├── web/        # Next.js 15 + React 19 — the website (runs on :3000)
│   └── desktop/    # Electron 35 + React 19 + Vite 5 (electron-vite) — desktop app
├── packages/
│   ├── ui/         # Shared React components (consumed via transpilePackages in Next.js)
│   ├── types/      # Shared TypeScript types (Game, User, Cart, Review, etc.)
│   └── api/        # Shared API client (createApiClient factory over fetch)
├── screenshot.mjs  # Puppeteer screenshot utility
└── turbo.json
```

All packages export TypeScript source directly (`"main": "./src/index.ts"`). Next.js and Vite compile them at build time — no separate package build step needed.

## Commands

| Task               | Command                                  |
| ------------------ | ---------------------------------------- |
| Dev (all)          | `pnpm dev`                               |
| Dev (web only)     | `pnpm --filter @steam-clone/web dev`     |
| Dev (desktop only) | `pnpm --filter @steam-clone/desktop dev` |
| Build all          | `pnpm build`                             |
| Type-check all     | `pnpm type-check`                        |
| Lint all           | `pnpm lint`                              |

## UI Guidelines

- **Mobile-first and responsive** — design for small screens first, scale up with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`).
- Shared components live in `packages/ui`. Add new ones there when both apps need them.
- Tailwind content paths in both apps include `../../packages/ui/src/**/*.{ts,tsx}` so shared component class names are always purged correctly.

## Reference Images

- Reference images are located under `/reference-images/` directory.
- If a reference image is provided for a page: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local server:

- **Always serve on localhost** - never screenshot a `file:///` URL.

## Screenshot Workflow

- Puppeteer is installed at `/home/sung/.nvm/versions/node/v22.16.0/bin/puppeteer/`. Chrome cache is at `/home/sung/.cache/puppeteer/`. However, the user might be in the WSL environment. In that case, the directories need to be prefixed with `//wsl.localhost/Ubuntu-20.04/` (e.g., `//wsl.localhost/Ubuntu-20.04//home/sung/.nvm/versions/node/v22.16.0/bin/puppeteer/`, `//wsl.localhost/Ubuntu-20.04/home/sung/.cache/puppeteer/`, respectively). If you run into any problem accessing either directory, alert the user right away.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temp-screenshots/screenshot-N.png` (N is auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temp-screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Brand Assets

- `brand-assets/brand-guide.json` — complete color tokens, typography, layout specs, component specs, and page layouts extracted from live Steam screenshots and the official brand guidelines PDF.
- `brand-assets/brand-guidelines-p01.png … p20.png` — first 20 pages of the official Steam Brand Guidelines PDF (logo usage, clear space, color specs).
- `brand-assets/steamLogo_300.jpg` — Steam logo raster asset.
- **Always read `brand-guide.json` before designing any Steam UI.** Use the exact hex values from `colors.*`. Never invent brand colors.
- Do not use placeholders where real assets are available.

### Key colors (quick reference)

| Token | Hex | Usage |
|---|---|---|
| `backgrounds.pageBase` | `#171a21` | Page / nav background |
| `backgrounds.contentDark` | `#1b2838` | Content panels |
| `backgrounds.cardBase` | `#16202d` | Game cards |
| `backgrounds.sidebarPanel` | `#2a475e` | Sidebar / secondary panels |
| `brand.steamCerulean` | `#00adee` | Official Steam brand blue |
| `brand.steamBlue` | `#1a9fff` | Interactive accent blue |
| `brand.accentLight` | `#66c0f4` | Links, highlights |
| `text.primary` | `#c7d5e0` | Body text |
| `text.secondary` | `#8f98a0` | Metadata, dimmed labels |
| `price.discountBadgeBg` | `#4c6b22` | Discount badge background |
| `price.discountBadgeText` | `#a4d007` | Discount percentage text |
| `price.salePrice` | `#acdbf5` | Final/sale price |

### Typography
- **Primary font:** Motiva Sans (load from Google Fonts or Adobe Fonts; fall back to `Arial, Helvetica, sans-serif`)
- **Logo font:** FF Din Bold
- Base size: 13px; nav/labels: 11–12px; headings: 18–36px

## Anti-Generic Guardrails

- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules

- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
