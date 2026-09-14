# Chris Machinery website

Next.js App Router (SSG pages + API for leads) for [chrismachinery.com](https://chrismachinery.com).

## Stack

- Next.js 16 / React 19 / TypeScript
- `next-intl` with `localePrefix: "as-needed"` (`/`, `/es/`, `/fr/`, `/ar/`)
- Montserrat + Inter, brand colors from the PRD
- JSON-LD on product pages, hreflang on key routes

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

```bash
npm run build
npm start
```

## Sanity CMS

Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID`. Product and blog pages fetch Sanity with ISR (`revalidate: 60`). Until the project ID is set, they fall back to `src/data`.

Studio (after `sanity init` / linking the project):

```bash
npm run sanity
```

- Products: `src/data/products.ts` (`stock_status`: In Stock / Made to Order / Out of Stock)
- Stock overrides: `/admin` (header key `ADMIN_KEY`, default `chris-local`) writes `src/data/stock-overrides.json`
- Leads: `POST /api/leads` (honeypot field `company_website`) stores `src/data/leads.json` and returns a quote PDF
- Optional: `LEADS_WEBHOOK_URL`, `SALES_NOTIFY_EMAIL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

Images and social URLs are placeholders (`[图片: …]`, `【LINK: …】`, `【TEXT: …】`) until assets arrive.

PRD copies live in `docs/`.
