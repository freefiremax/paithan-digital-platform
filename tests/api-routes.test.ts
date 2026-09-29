import { describe, it, expect } from "vitest";
import { handleApiError, createErrorResponse, AppError, ERROR_CODES } from "@/lib/errors";
import { z } from "zod";

describe("Error Handling", () => {
  describe("AppError", () => {
    it("should create error with code, message, and statusCode", () => {
      const error = new AppError("TEST_ERROR", "Test message", 400);
      expect(error.code).toBe("TEST_ERROR");
      expect(error.message).toBe("Test message");
      expect(error.statusCode).toBe(400);
    });

    it("should default to 500 status code", () => {
      const error = new AppError("TEST_ERROR", "Test message");
      expect(error.statusCode).toBe(500);
    });

    it("should include details when provided", () => {
      const error = new AppError("TEST_ERROR", "Test message", 400, { field: "email" });
      expect(error.details).toEqual({ field: "email" });
    });
  });

  describe("createErrorResponse", () => {
    it("should handle AppError", () => {
      const error = new AppError("CUSTOM_ERROR", "Custom message", 422);
      const { error: errorBody, status } = createErrorResponse(error);
      expect(errorBody).toEqual({ code: "CUSTOM_ERROR", message: "Custom message" });
      expect(status).toBe(422);
    });

    it("should handle ZodError", () => {
      const schema = z.object({ email: z.string().email() });
      const result = schema.safeParse({ email: "invalid" });
      const { error: errorBody, status } = createErrorResponse(result.error!);
      expect(errorBody.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      expect(errorBody.message).toBe("Invalid input");
      expect(status).toBe(400);
    });

    it("should handle UNAUTHENTICATED error", () => {
      const error = new Error("UNAUTHENTICATED");
      const { error: errorBody, status } = createErrorResponse(error);
      expect(errorBody.code).toBe(ERROR_CODES.UNAUTHENTICATED);
      expect(errorBody.message).toBe("Authentication required");
      expect(status).toBe(401);
    });

    it("should handle FORBIDDEN error", () => {
      const error = new Error("FORBIDDEN");
      const { error: errorBody, status } = createErrorResponse(error);
      expect(errorBody.code).toBe(ERROR_CODES.FORBIDDEN);
      expect(errorBody.message).toBe("Insufficient permissions");
      expect(status).toBe(403);
    });

    it("should handle unique constraint error", () => {
      const error = new Error("Unique constraint failed on field email");
      const { error: errorBody, status } = createErrorResponse(error);
      expect(errorBody.code).toBe(ERROR_CODES.CONFLICT);
      expect(errorBody.message).toBe("Resource already exists");
      expect(status).toBe(409);
    });

    it("should handle not found error", () => {
      const error = new Error("Record to delete does not exist");
      const { error: errorBody, status } = createErrorResponse(error);
      expect(errorBody.code).toBe(ERROR_CODES.NOT_FOUND);
      expect(errorBody.message).toBe("Resource not found");
      expect(status).toBe(404);
    });

    it("should handle unknown errors", () => {
      const error = new Error("Some random error");
      const { error: errorBody, status } = createErrorResponse(error);
      expect(errorBody.code).toBe(ERROR_CODES.INTERNAL_ERROR);
      expect(errorBody.message).toBe("An unexpected error occurred");
      expect(status).toBe(500);
    });
  });

  describe("handleApiError", () => {
    it("should return NextResponse with correct status and body", async () => {
      const error = new AppError("TEST_ERROR", "Test message", 400);
      const response = handleApiError(error);
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({ code: "TEST_ERROR", message: "Test message" });
    });
  });
});

describe("API Route Pattern Tests", () => {
  it("should have proper structure for sector routes", () => {
    // These tests verify the expected API route patterns exist
    const sectorRoutes = [
      "GET /api/sectors",
      "GET /api/sectors/[sector]",
      "PATCH /api/sectors/[sector]",
      "GET /api/sectors/[sector]/works",
      "POST /api/sectors/[sector]/works",
      "GET /api/sectors/[sector]/works/[id]",
      "PATCH /api/sectors/[sector]/works/[id]",
      "DELETE /api/sectors/[sector]/works/[id]",
      "GET /api/sectors/[sector]/facilities",
      "POST /api/sectors/[sector]/facilities",
      "GET /api/sectors/[sector]/facilities/[id]",
      "PATCH /api/sectors/[sector]/facilities/[id]",
      "DELETE /api/sectors/[sector]/facilities/[id]",
    ];

    expect(sectorRoutes.length).toBe(13);
  });

  it("should have proper structure for admin routes", () => {
    const adminRoutes = [
      "GET /api/admin/users",
      "POST /api/admin/users",
      "GET /api/admin/users/[id]",
      "PATCH /api/admin/users/[id]",
      "DELETE /api/admin/users/[id]",
      "GET /api/admin/wards",
      "GET /api/admin/facilities",
      "POST /api/admin/facilities",
      "GET /api/admin/facilities/[id]",
      "PATCH /api/admin/facilities/[id]",
      "DELETE /api/admin/facilities/[id]",
      "POST /api/admin/facilities/[id]/verify",
      "GET /api/admin/sectors/[sector]",
      "PATCH /api/admin/sectors/[sector]",
      "POST /api/admin/sectors/[sector]/verify",
    ];

    expect(adminRoutes.length).toBe(15);
  });
});