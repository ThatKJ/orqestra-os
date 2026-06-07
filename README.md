# Orquestra OS Waitlist

The execution layer for AI workflows — waitlist landing page with admin dashboard.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **Analytics:** Plausible
- **Validation:** Zod
- **Deployment:** Vercel

## Setup

### 1. Clone & Install

```bash
npm install
```

### 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → run the migration in `supabase/migrations/001_create_waitlist.sql`
3. Go to **Project Settings** → **API** → copy your URL, anon key, and service_role key

### 3. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the values:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (safe for client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `RESEND_API_KEY` | Resend API key for email notifications |
| `NOTIFICATION_EMAIL` | Email to receive waitlist notifications (e.g., orquestra.team@gmail.com) |
| `ADMIN_PASSWORD` | Password for the admin dashboard |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Your domain for Plausible analytics (optional) |
| `NEXT_PUBLIC_PLAUSIBLE_SCRIPT` | Plausible script URL (optional, defaults to cloud) |
| `NEXT_PUBLIC_APP_URL` | Application URL (used in email notifications) |

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Admin Dashboard

Navigate to `/admin/login` and enter the `ADMIN_PASSWORD`.

## API

### `POST /api/waitlist`

Register a new waitlist entry.

**Request body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "company": "Acme Corp",
  "useCase": "AI workflow orchestration",
  "source": "twitter"
}
```

- Only `email` is required
- `source` defaults to `direct` if not provided
- UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`) are also tracked

**Response (201):**
```json
{ "success": true, "message": "You've been added to the waitlist!" }
```

**Errors:**
- `400` — Validation failed
- `409` — Duplicate email
- `429` — Rate limited

## Source Tracking

Sources are tracked via:
1. `utm_source` URL parameter
2. `source` URL parameter
3. `source` field in POST body
4. Falls back to `"direct"`

## Security

- **Rate limiting:** 5 requests per minute per IP (in-memory; use Vercel KV for production)
- **Validation:** Zod schemas on both client and server
- **Duplicate prevention:** Unique constraint on lowercase email + server-side check
- **Admin auth:** Cookie-based session with HTTP-only cookie
- **Bot protection:** Rate limiting + email validation provide basic protection
- **RLS:** Supabase Row Level Security — anon can only insert, service_role can read

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example` in Vercel Dashboard
4. Deploy

For production rate limiting, add [Vercel KV](https://vercel.com/docs/storage/vercel-kv) and replace the in-memory rate limiter.

## Design System

See the original design spec in `DESIGN.md` for colors, typography, spacing, and component guidelines.
