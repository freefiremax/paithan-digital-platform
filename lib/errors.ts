export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const ERROR_CODES = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export function createErrorResponse(error: unknown): { error: { code: string; message: string }; status: number } {
  if (error instanceof AppError) {
    return {
      error: { code: error.code, message: error.message },
      status: error.statusCode,
    };
  }

  if (error instanceof z.ZodError) {
    return {
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Invalid input",
      },
      status: 400,
    };
  }

  if (error instanceof Error) {
    if (error.message === "UNAUTHENTICATED") {
      return {
        error: { code: ERROR_CODES.UNAUTHENTICATED, message: "Authentication required" },
        status: 401,
      };
    }
    if (error.message === "FORBIDDEN") {
      return {
        error: { code: ERROR_CODES.FORBIDDEN, message: "Insufficient permissions" },
        status: 403,
      };
    }
    if (error.message.includes("Unique constraint")) {
      return {
        error: { code: ERROR_CODES.CONFLICT, message: "Resource already exists" },
        status: 409,
      };
    }
    if (error.message.includes("Record to delete does not exist")) {
      return {
        error: { code: ERROR_CODES.NOT_FOUND, message: "Resource not found" },
        status: 404,
      };
    }
  }

  console.error("Unhandled error:", error);
  return {
    error: { code: ERROR_CODES.INTERNAL_ERROR, message: "An unexpected error occurred" },
    status: 500,
  };
}

import { NextResponse } from "next/server";
import { z } from "zod";

export function handleApiError(error: unknown): NextResponse {
  const { error: errorBody, status } = createErrorResponse(error);
  return NextResponse.json(errorBody, { status });
}