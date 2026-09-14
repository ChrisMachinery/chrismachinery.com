import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export function expectedAdminKey() {
  const key = process.env.ADMIN_KEY?.trim();
  if (key) return key;
  if (process.env.NODE_ENV === "production") return "";
  return "chris-local";
}

export function isAuthorizedAdmin(req: NextRequest) {
  const expected = expectedAdminKey();
  if (!expected) return false;
  const got = req.headers.get("x-admin-key") ?? "";
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
