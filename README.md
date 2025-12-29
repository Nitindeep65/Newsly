# AI Tools Weekly

A modern newsletter platform for curating and sharing the latest AI tools. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🤖 **AI-Powered Newsletter Generation** - Automated newsletter creation using Google Gemini
- 📧 **Email Delivery** - Newsletter delivery via Resend
- 💳 **Subscription Tiers** - Free, Pro, and Premium tiers with PhonePe payment integration
- 🔐 **Authentication** - Secure auth with Clerk
- 📊 **Admin Dashboard** - Manage tools, subscribers, and newsletters
- 🎨 **Modern UI** - Built with Radix UI and shadcn/ui components

## Quick Start

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment**

Create a `.env.local` file with your credentials:

```text
# Database (Neon PostgreSQL)
DATABASE_URL="your_neon_connection_string"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Google Gemini AI
GOOGLE_API_KEY=your_google_api_key

# Resend Email
RESEND_API_KEY=re_xxx

# PhonePe Payment
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=sandbox
```

3. **Setup database**

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

4. **Run the app**

```bash
npm run dev
```

Open http://localhost:3000 (public) and http://localhost:3000/admin-panel (admin).

## Project Structure

- `src/app/` — App Router pages and API routes
  - `admin-panel/` — Admin dashboard pages
  - `api/` — Server API routes
  - `dashboard/` — User dashboard
  - `tools/` — AI tools directory
- `src/components/` — React components
  - `admin-panel/` — Admin UI components
  - `tools/` — Tool display components
  - `ui/` — Shared UI components
- `src/lib/` — Utilities and services
  - `ai-newsletter.ts` — AI newsletter generation
  - `db.ts` — Prisma database client
  - `phonepe.ts` — Payment integration

## Key Features

### Newsletter System
- Auto-generated newsletters at 8AM, 2PM, and 6PM IST
- AI-powered content curation based on user interests
- Rich HTML email templates

### Subscription Tiers
- **Free** - Access to curated tools
- **Pro (₹3/month)** - AI summaries and personalized recommendations
- **Premium (₹10/month)** - All features + exclusive tools

### Admin Dashboard
- Add/edit AI tools
- Manage subscribers
- View newsletter history
- Send manual newsletters

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
