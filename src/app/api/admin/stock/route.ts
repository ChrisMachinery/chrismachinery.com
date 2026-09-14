import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { readStockOverrides, writeStockOverrides } from "@/lib/leads";

function authorized(req: NextRequest) {
  return isAuthorizedAdmin(req);
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readStockOverrides());
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as Record<string, string>;
  await writeStockOverrides(body);
  return NextResponse.json({ ok: true });
}
