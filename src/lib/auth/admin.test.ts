import { describe, it, expect, afterEach } from "vitest";
import { adminLineIds, isAdmin } from "./admin";

const original = process.env.ADMIN_LINE_USER_IDS;
afterEach(() => {
  process.env.ADMIN_LINE_USER_IDS = original;
});

describe("admin allowlist", () => {
  it("parses a comma-separated list with whitespace", () => {
    process.env.ADMIN_LINE_USER_IDS = "Uaaa, Ubbb ,Uccc";
    expect(adminLineIds()).toEqual(["Uaaa", "Ubbb", "Uccc"]);
  });

  it("returns empty when unset", () => {
    delete process.env.ADMIN_LINE_USER_IDS;
    expect(adminLineIds()).toEqual([]);
  });

  it("identifies admins and rejects others", () => {
    process.env.ADMIN_LINE_USER_IDS = "Uadmin";
    expect(isAdmin({ line_user_id: "Uadmin" })).toBe(true);
    expect(isAdmin({ line_user_id: "Uother" })).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });
});
