import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is disabled in production" },
      { status: 403 }
    );
  }

  try {
    // Capture a test message
    Sentry.captureMessage("E2E Sentry test event", "info");

    // Capture a test error
    try {
      throw new Error("E2E Sentry test error - safe to ignore");
    } catch (error) {
      Sentry.captureException(error);
    }

    return NextResponse.json({
      message: "Test events sent to Sentry",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send test event to Sentry" },
      { status: 500 }
    );
  }
}