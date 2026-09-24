import { NextRequest } from "next/server";

const FASTAPI_URL =
  process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { jobId } = await context.params;

    const response = await fetch(
      `${FASTAPI_URL}/api/download/${jobId}/file`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const body = await response.text();

      return new Response(body, {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("Content-Type") ||
            "application/json",
        },
      });
    }

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ||
          "application/octet-stream",
        "Content-Disposition":
          response.headers.get("Content-Disposition") || "",
      },
    });
  } catch {
    return Response.json(
      {
        detail: "Unable to connect to the downloader service.",
      },
      { status: 502 },
    );
  }
}
