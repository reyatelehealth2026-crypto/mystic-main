"use client";

import * as React from "react";
import { loginWithLiff, isInLineClient } from "@/lib/auth/liff";
import { syncLocalHistoryToServer } from "@/lib/auth/syncLocal";

export interface AuthUser {
  id: string;
  displayName: string | null;
  pictureUrl: string | null;
  statusMessage?: string | null;
  credits: number;
  membershipTier: string;
  isAdmin: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

/**
 * Client auth context. Effect-driven (no SSR state) to match the StoreHydrator
 * discipline and avoid React 19 hydration mismatches. On mount it fetches the
 * session; inside the LINE app it auto-attempts LIFF login.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      const resp = await fetch("/api/auth/session", { cache: "no-store" });
      const data = (await resp.json()) as { user: AuthUser | null };
      setUser(data.user ?? null);
      if (data.user) void syncLocalHistoryToServer(data.user.id);
    } catch {
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      // Auto-login when running inside the LINE app.
      try {
        if (await isInLineClient()) {
          await loginWithLiff();
        }
      } catch {
        // ignore — fall through to session check
      }
      if (cancelled) return;
      await refresh();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const login = React.useCallback(() => {
    // Inside LINE → LIFF; otherwise web OAuth redirect.
    void (async () => {
      if (await isInLineClient()) {
        await loginWithLiff();
        await refresh();
      } else {
        const returnTo = window.location.pathname + window.location.search;
        window.location.href = `/api/auth/line/login?returnTo=${encodeURIComponent(returnTo)}`;
      }
    })();
  }, [refresh]);

  const logout = React.useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, loading, login, logout, refresh }),
    [user, loading, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
