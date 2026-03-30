# Frontend Dashboard Starter

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Supabase (`@supabase/supabase-js` + `@supabase/ssr`)
- No linting setup

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm typecheck
```

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

## Supabase Client Usage

Use the shared exports from one place:

```ts
import { getSupabaseServerClient, getSupabaseBrowserClient } from "@/utils/supabase";
```

- `getSupabaseBrowserClient()` returns a singleton browser client.
- `getSupabaseServerClient()` returns a request-cached server client for App Router server code.

Session refresh is handled in `proxy.ts` via `utils/supabase/middleware.ts`.
