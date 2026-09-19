function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
}

export function draftModeCookieFlags(request: Request) {
  const hostname = new URL(request.url).hostname;
  if (isLocalHost(hostname)) {
    return {
      httpOnly: true,
      path: "/",
      secure: false,
      sameSite: "lax" as const,
    };
  }
  const partitioned =
    request.headers.get("sec-fetch-dest") === "iframe" &&
    request.headers.get("sec-fetch-site") === "cross-site";
  return {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none" as const,
    partitioned,
  };
}
