import { cookies, draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const cookieBase = {
  httpOnly: true,
  path: "/",
  secure: true,
  sameSite: "none" as const,
};

function safeRedirectPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return "/";
  if (path.startsWith("/api/draft-mode")) return "/";
  return path;
}

export async function GET(request: NextRequest) {
  try {
    (await draftMode()).disable();
    const store = await cookies();
    for (const name of ["__prerender_bypass", "__next_preview_data"]) {
      store.set({ name, value: "", ...cookieBase, maxAge: 0 });
    }

    const target = safeRedirectPath(request.nextUrl.searchParams.get("redirect") || "/");
    const response = NextResponse.redirect(new URL(target, request.nextUrl.origin));
    response.cookies.set({ name: "__prerender_bypass", value: "", ...cookieBase, maxAge: 0 });
    response.cookies.set({ name: "__next_preview_data", value: "", ...cookieBase, maxAge: 0 });
    return response;
  } catch (error) {
    console.error("[draft-mode/disable]", error);
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }
}
