import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

let cachedSpec: object | null = null;

export async function GET() {
  if (!cachedSpec) {
    const raw = readFileSync(join(process.cwd(), "public", "openapi.json"), "utf-8");
    cachedSpec = JSON.parse(raw);
  }
  return NextResponse.json(cachedSpec, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
