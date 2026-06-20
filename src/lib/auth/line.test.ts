import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { verifyLineIdToken, buildAuthorizeUrl } from "./line";

beforeEach(() => {
  process.env.LINE_LOGIN_CHANNEL_ID = "1234567890";
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("verifyLineIdToken", () => {
  it("returns identity for a valid token", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ sub: "Uabc", name: "สมชาย", picture: "https://x/y.png", aud: "1234567890" }), {
        status: 200,
      }),
    );
    const id = await verifyLineIdToken("token");
    expect(id.lineUserId).toBe("Uabc");
    expect(id.displayName).toBe("สมชาย");
  });

  it("throws on aud mismatch", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ sub: "Uabc", aud: "9999" }), { status: 200 }),
    );
    await expect(verifyLineIdToken("token")).rejects.toThrow("aud_mismatch");
  });

  it("throws when LINE rejects the token", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("invalid", { status: 400 }));
    await expect(verifyLineIdToken("token")).rejects.toThrow("line_id_token_invalid");
  });
});

describe("buildAuthorizeUrl", () => {
  it("includes the required OAuth params", () => {
    const url = buildAuthorizeUrl({ redirectUri: "https://app/cb", state: "s1", nonce: "n1" });
    const parsed = new URL(url);
    expect(parsed.searchParams.get("client_id")).toBe("1234567890");
    expect(parsed.searchParams.get("redirect_uri")).toBe("https://app/cb");
    expect(parsed.searchParams.get("state")).toBe("s1");
    expect(parsed.searchParams.get("nonce")).toBe("n1");
    expect(parsed.searchParams.get("scope")).toContain("openid");
  });
});
