import { headers } from "next/headers";

export async function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return new URL(process.env.NEXT_PUBLIC_SITE_URL);
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const isLocal = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  return new URL(`${isLocal ? "http" : "https"}://${host}`);
}
