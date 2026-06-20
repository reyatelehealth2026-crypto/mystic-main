import { describe, it, expect, beforeAll, vi } from "vitest";

// `next/headers` cookies() isn't available outside a request scope; we only test
// the pure sign/verify logic here.
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined, set: () => {} }) }));

import { signSession, verifySession } from "./session";

beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret-at-least-32-bytes-long-xxxxx";
});

describe("session JWT", () => {
  it("round-trips a valid payload", async () => {
    const token = await signSession({ userId: "u1", lineUserId: "Uabc" });
    const payload = await verifySession(token);
    expect(payload).toEqual({ userId: "u1", lineUserId: "Uabc" });
  });

  it("rejects a tampered token", async () => {
    const token = await signSession({ userId: "u1", lineUserId: "Uabc" });
    const tampered = token.slice(0, -3) + "abc";
    expect(await verifySession(tampered)).toBeNull();
  });

  it("rejects garbage", async () => {
    expect(await verifySession("not-a-jwt")).toBeNull();
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signSession({ userId: "u1", lineUserId: "Uabc" });
    process.env.SESSION_SECRET = "a-completely-different-secret-value-yyyy";
    expect(await verifySession(token)).toBeNull();
    process.env.SESSION_SECRET = "test-secret-at-least-32-bytes-long-xxxxx";
  });
});
