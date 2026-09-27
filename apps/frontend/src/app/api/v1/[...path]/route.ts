import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Same-origin, GET-only gateway. Database credentials never reach the browser.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  if (!["cities", "air-quality"].includes(path[0])) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }
  const backend = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";
  try {
    const url = new URL(`/api/v1/${path.map(encodeURIComponent).join("/")}`, backend);
    url.search = request.nextUrl.search;
    const response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(10_000)]),
    });
    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Invalid upstream response");
    }
    return NextResponse.json(await response.json(), {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ detail: "Data service unavailable" }, { status: 503 });
  }
}
