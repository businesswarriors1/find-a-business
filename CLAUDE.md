# findabusiness.com.au — Project Context

## Stack
- **Framework:** Next.js 14 (App Router) — SSR by default
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **DB:** Supabase (Postgres, free tier)
- **Auth:** Supabase Auth (admin only for V1)
- **Rate Limiting:** Upstash Redis
- **Email:** Resend
- **Maps:** Google Maps Embed API
- **Icons:** Lucide React

## Key Conventions
- `src/` directory structure
- TypeScript throughout
- App Router — all pages in `src/app/`
- API routes at `src/app/api/`
- Components in `src/components/`
- Lib utilities in `src/lib/`
- Types in `src/types/`

## Design System
- Primary blue: #0D6EFD
- CTA orange: #F97316
- Success green: #16A34A
- Dark text: #111827
- Mid text: #6B7280
- Light bg: #F3F4F6
- Borders: #E5E7EB
- Font: DM Sans (headings), Inter (body)
- Cards: 1px border #E5E7EB, 8px radius, subtle shadow on hover
- Buttons: primary solid orange, secondary outlined blue, ghost text-only
- Inputs: 44px min height, 4px radius, focus ring #0D6EFD

## Page Structure
- `/` — Homepage with search hero, category grid, state grid
- `/[state]/` — State hub page
- `/[category]/` — Category hub page
- `/[state]/[category]/` — State × Category
- `/[state]/[suburb]/` — Suburb hub page
- `/[state]/[suburb]/[category]/` — Money page (suburb × category)
- `/business/[slug]/` — Individual listing page
- `/get-listed/` — Chat intake page
- `/admin/*` — Admin dashboard (auth-gated)
- `/about/`, `/contact/`, `/privacy/`, `/terms/`

## Env Vars (server-side only unless prefixed NEXT_PUBLIC_)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server only)
- ANTHROPIC_API_KEY (server only)
- GOOGLE_MAPS_API_KEY (server only)
- RESEND_API_KEY (server only)
- SLACK_WEBHOOK_URL (server only)
- UPSTASH_REDIS_REST_URL (server only)
- UPSTASH_REDIS_REST_TOKEN (server only)
- ADMIN_EMAIL (server only)

## Already done
- Next.js 14 scaffolded with TypeScript, Tailwind, App Router, src dir
- All dependencies installed (supabase, upstash, resend, lucide, radix-ui)
- Directory structure created
- This is Next.js 16 (check docs in node_modules/next/dist/docs/ if needed)
