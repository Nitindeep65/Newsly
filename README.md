Newsly — Admin dashboard & Reader

This repository contains Newsly, a Next.js (App Router) news reader and admin dashboard built with TypeScript and Tailwind.

This README focuses on developer onboarding: structure, how to run, common tasks, and safe configuration. It intentionally does not include any API keys or sensitive values.

## Quick start (local)

1. Install dependencies

```bash
npm install
```

2. Configure non-secret environment values

Create a `.env.local` file at the project root and add non-sensitive configuration values. Example:

```text
# Show or hide images in the UI (true/false)
NEXT_PUBLIC_SHOW_IMAGES=true

# Optional: base url for non-secret services
NEXT_PUBLIC_API_URL=https://api.example.com
```

3. Run the app

```bash
npm run dev
# or for a production build
npm run build && npm start
```

Open http://localhost:3000 (public) and http://localhost:3000/admin-panel (admin).

## What this app does (short)

- Fetches news server-side (Finlight integration).
- Provides a public reader and an admin dashboard with a two-column comparison preview.
- AI summarization endpoint with a safe local fallback; LLM usage is optional and only enabled when server-side keys are configured (store keys securely, not in this repo).
- Image proxy endpoint for normalizing external images.
- Bookmarks persisted in-browser (localStorage) and visible in the admin panel.

## Project layout (high level)

- `src/app/` — App Router routes and page-level components
	- `admin-panel/` — admin pages: dashboard, news comparison, bookmarks, etc.
	- `api/` — server routes (image proxy, summary endpoint, finlight wrappers)
- `src/components/` — UI components and small feature groups
	- `news/` — `NewsTile`, `NewsGrid`, `NewsComparison`
	- `admin-panel/` — sidebar, layout, menu
	- `ui/` — `SmartImage`, buttons, cards, etc.
- `src/lib/` — application libraries and helpers
	- `api/news.ts` — `NewsArticle` types and fetching helpers
	- `finlight.ts` — server-side Finlight integration
	- `app-config.ts` — runtime flags (e.g., `SHOW_IMAGES`)

## Important files to review

- `src/components/news/news-comparison.tsx` — admin two-column preview + summary UI
- `src/components/ui/smart-image.tsx` — image proxy + fallback behavior
- `src/app/api/news/summary/route.ts` — summary API (local fallback + guarded LLM path)
- `src/app/api/image-proxy/route.ts` — server route that proxies external images

## Toggle images (safe, no secrets)

You can hide all images in the UI by setting:

```text
NEXT_PUBLIC_SHOW_IMAGES=false
```

This flag is read by `src/lib/app-config.ts` and respected by the image components.

## Notes on secrets and LLM usage

- The project supports an optional LLM path in the summary API. Do NOT add any API keys to source control. Configure secret keys in your deployment environment (Vercel, Netlify, etc.).
- This README does not list any private keys or endpoints.

## Developer tips

- When adding routes under `src/app`, ensure files are valid TSX/TS — invalid files will be ignored by the App Router and cause 404s.
- Use `SmartImage` for external images to get proxying + graceful fallbacks.
- Bookmarks are intentionally kept in localStorage for now; implementing server persistence requires adding a small API and updating `NewsTile`'s save/load logic.

## Linting & tests

- Run your project's linter/formatters if configured (for example `npm run lint`).
- Add tests for server routes and important UI flows if desired.

---

If you'd like, I can:

- Add a short developer checklist (how to add a route, debug Turbopack errors).
- Add a lightweight CONTRIBUTING.md explaining commit / PR workflow for this repo.

Tell me which extras you want and I'll add them without exposing any secrets.
