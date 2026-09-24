import { NextRequest } from "next/server";

const FASTAPI_URL =
  process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const response = await fetch(`${FASTAPI_URL}/api/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const contentType =
      response.headers.get("Content-Type") ?? "application/json";

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch {
    return Response.json(
      { detail: "Unable to connect to the downloader service." },
      { status: 502 },
    );
  }
}


