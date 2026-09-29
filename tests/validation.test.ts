import { describe, it, expect } from "vitest";
import {
  developmentWorkCreateSchema,
  developmentWorkUpdateSchema,
  facilityCreateSchema,
  civicSectorInfoUpdateSchema,
  loginSchema,
  createUserSchema,
  verifyContentSchema,
  paginationSchema,
  sectorSlugParamSchema,
} from "@/lib/validation";

describe("Validation Schemas", () => {
  describe("developmentWorkCreateSchema", () => {
    it("should validate a valid development work", () => {
      const validData = {
        title: "Test Work",
        titleMr: "परीक्षण काम",
        wardId: "clx1234567890abcdef123456",
        sector: "ROADS_TRANSPORT",
        description: "A test development work",
        descriptionMr: "एक परीक्षण विकास कार्य",
        status: "PLANNED",
        startDate: "2026-01-01T00:00:00.000Z",
        expectedCompletion: "2026-12-31T00:00:00.000Z",
        department: "Road Engineering",
        budget: 100.5,
        progressPct: 50,
        images: ["https://example.com/image.jpg"],
        locationLatLng: { lat: 19.48, lng: 75.38 },
        dataStatus: "SAMPLE_TBD",
      };

      const result = developmentWorkCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid sector", () => {
      const invalidData = {
        title: "Test Work",
        wardId: "clx1234567890abcdef123456",
        sector: "INVALID_SECTOR",
        description: "A test development work",
        department: "Road Engineering",
      };

      const result = developmentWorkCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject progressPct out of range", () => {
      const invalidData = {
        title: "Test Work",
        wardId: "clx1234567890abcdef123456",
        sector: "ROADS_TRANSPORT",
        description: "A test development work",
        department: "Road Engineering",
        progressPct: 150,
      };

      const result = developmentWorkCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject negative budget", () => {
      const invalidData = {
        title: "Test Work",
        wardId: "clx1234567890abcdef123456",
        sector: "ROADS_TRANSPORT",
        description: "A test development work",
        department: "Road Engineering",
        budget: -100,
      };

      const result = developmentWorkCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid URL in images", () => {
      const invalidData = {
        title: "Test Work",
        wardId: "clx1234567890abcdef123456",
        sector: "ROADS_TRANSPORT",
        description: "A test development work",
        department: "Road Engineering",
        images: ["not-a-url"],
      };

      const result = developmentWorkCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject unexpected fields (strict)", () => {
      const invalidData = {
        title: "Test Work",
        wardId: "clx1234567890abcdef123456",
        sector: "ROADS_TRANSPORT",
        description: "A test development work",
        department: "Road Engineering",
        unexpectedField: "should fail",
      };

      const result = developmentWorkCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("developmentWorkUpdateSchema", () => {
    it("should allow partial updates", () => {
      const partialData = {
        title: "Updated Title",
        progressPct: 75,
      };

      const result = developmentWorkUpdateSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });
  });

  describe("facilityCreateSchema", () => {
    it("should validate a valid facility", () => {
      const validData = {
        sector: "HEALTH",
        type: "PHC",
        nameEn: "Primary Health Center",
        nameMr: "प्राथमिक आरोग्य केंद्र",
        address: "Ward 1, Paithan",
        contactJson: { phone: "02431-223040" },
        wardId: "clx1234567890abcdef123456",
        isOperational: true,
        dataStatus: "SAMPLE_TBD",
      };

      const result = facilityCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid facility type", () => {
      const invalidData = {
        sector: "HEALTH",
        type: "INVALID_TYPE",
        nameEn: "Test Facility",
        address: "Ward 1, Paithan",
      };

      const result = facilityCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("civicSectorInfoUpdateSchema", () => {
    it("should validate sector info update", () => {
      const validData = {
        titleEn: "Updated Title",
        titleMr: "अपडेट केलेला शीर्षक",
        taglineEn: "Updated tagline",
        taglineMr: "अपडेट केलेला टॅगलाइन",
        overviewEn: "Updated overview",
        overviewMr: "अपडेट केलेला अवलोकन",
        department: "Updated Department",
        contactJson: { phone: "02431-223010" },
        dataStatus: "VERIFIED",
      };

      const result = civicSectorInfoUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("loginSchema", () => {
    it("should validate valid login credentials", () => {
      const validData = {
        email: "test@paithan.gov.in",
        password: "password123",
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "not-an-email",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("createUserSchema", () => {
    it("should validate valid user creation", () => {
      const validData = {
        email: "newuser@paithan.gov.in",
        name: "New User",
        password: "securepassword123",
        role: "EDITOR",
        wardId: "clx1234567890abcdef123456",
      };

      const result = createUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject password too short", () => {
      const invalidData = {
        email: "newuser@paithan.gov.in",
        password: "short",
        role: "EDITOR",
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid role", () => {
      const invalidData = {
        email: "newuser@paithan.gov.in",
        password: "securepassword123",
        role: "INVALID_ROLE",
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("verifyContentSchema", () => {
    it("should only allow VERIFIED", () => {
      const validData = { dataStatus: "VERIFIED" };
      const result = verifyContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject SAMPLE_TBD", () => {
      const invalidData = { dataStatus: "SAMPLE_TBD" };
      const result = verifyContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("paginationSchema", () => {
    it("should use defaults", () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.pageSize).toBe(20);
      }
    });

    it("should cap pageSize at 100", () => {
      const result = paginationSchema.safeParse({ pageSize: 200 });
      expect(result.success).toBe(false);
    });

    it("should reject negative page", () => {
      const result = paginationSchema.safeParse({ page: -1 });
      expect(result.success).toBe(false);
    });
  });

  describe("sectorSlugParamSchema", () => {
    it("should validate valid sector enum values", () => {
      const validEnums = [
        "ROADS_TRANSPORT",
        "WATER_SANITATION",
        "EDUCATION",
        "HEALTH",
        "OTHER_CIVIC_WORKS",
      ];

      for (const enumVal of validEnums) {
        const result = sectorSlugParamSchema.safeParse({ sector: enumVal });
        expect(result.success).toBe(true);
      }
    });

    it("should reject invalid sector enum", () => {
      const result = sectorSlugParamSchema.safeParse({ sector: "invalid-sector" });
      expect(result.success).toBe(false);
    });
  });
});