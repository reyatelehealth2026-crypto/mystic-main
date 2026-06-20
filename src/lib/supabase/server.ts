import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service-role key.
 *
 * SECURITY: the service-role key bypasses RLS and must NEVER reach the browser.
 * Only import this module from server-side code (route handlers, server
 * components, server lib functions). Env is read with `process.env` directly,
 * matching the existing `GEMINI_API_KEY` pattern (OpenNext maps Worker secrets
 * into `process.env`).
 *
 * We use only the PostgREST/HTTP transport (`.from().select/insert/...`) which
 * is Cloudflare-Workers safe. Realtime/storage stream features are unused.
 */

let cached: SupabaseClient | null = null;

export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getServiceClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new SupabaseConfigError(
      "missing_supabase_env: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
