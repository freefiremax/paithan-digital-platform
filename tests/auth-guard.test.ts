import { describe, it, expect } from "vitest";
import { Role } from "@prisma/client";
import { hasRole, can, canAccessWard, PERMISSIONS } from "@/lib/auth/permissions";

describe("Auth Permissions", () => {
  describe("hasRole", () => {
    it("should return true when user role equals required role", () => {
      expect(hasRole(Role.ADMIN, Role.ADMIN)).toBe(true);
      expect(hasRole(Role.EDITOR, Role.EDITOR)).toBe(true);
      expect(hasRole(Role.PUBLIC, Role.PUBLIC)).toBe(true);
    });

    it("should return true when user role is higher than required", () => {
      expect(hasRole(Role.ADMIN, Role.EDITOR)).toBe(true);
      expect(hasRole(Role.ADMIN, Role.PUBLIC)).toBe(true);
      expect(hasRole(Role.EDITOR, Role.PUBLIC)).toBe(true);
    });

    it("should return false when user role is lower than required", () => {
      expect(hasRole(Role.PUBLIC, Role.EDITOR)).toBe(false);
      expect(hasRole(Role.PUBLIC, Role.ADMIN)).toBe(false);
      expect(hasRole(Role.EDITOR, Role.ADMIN)).toBe(false);
    });
  });

  describe("can", () => {
    it("should allow PUBLIC to read sectors", () => {
      expect(can(Role.PUBLIC, "sector", "read")).toBe(true);
    });

    it("should allow EDITOR to read sectors", () => {
      expect(can(Role.EDITOR, "sector", "read")).toBe(true);
    });

    it("should allow ADMIN to read sectors", () => {
      expect(can(Role.ADMIN, "sector", "read")).toBe(true);
    });

    it("should only allow ADMIN to update sectors", () => {
      expect(can(Role.ADMIN, "sector", "update")).toBe(true);
      expect(can(Role.EDITOR, "sector", "update")).toBe(false);
      expect(can(Role.PUBLIC, "sector", "update")).toBe(false);
    });

    it("should only allow ADMIN to verify sectors", () => {
      expect(can(Role.ADMIN, "sector", "verify")).toBe(true);
      expect(can(Role.EDITOR, "sector", "verify")).toBe(false);
      expect(can(Role.PUBLIC, "sector", "verify")).toBe(false);
    });

    it("should allow EDITOR and ADMIN to create works", () => {
      expect(can(Role.EDITOR, "work", "create")).toBe(true);
      expect(can(Role.ADMIN, "work", "create")).toBe(true);
      expect(can(Role.PUBLIC, "work", "create")).toBe(false);
    });

    it("should allow EDITOR and ADMIN to update works", () => {
      expect(can(Role.EDITOR, "work", "update")).toBe(true);
      expect(can(Role.ADMIN, "work", "update")).toBe(true);
      expect(can(Role.PUBLIC, "work", "update")).toBe(false);
    });

    it("should allow EDITOR and ADMIN to delete works", () => {
      expect(can(Role.EDITOR, "work", "delete")).toBe(true);
      expect(can(Role.ADMIN, "work", "delete")).toBe(true);
      expect(can(Role.PUBLIC, "work", "delete")).toBe(false);
    });

    it("should only allow ADMIN to verify works", () => {
      expect(can(Role.ADMIN, "work", "verify")).toBe(true);
      expect(can(Role.EDITOR, "work", "verify")).toBe(false);
      expect(can(Role.PUBLIC, "work", "verify")).toBe(false);
    });

    it("should allow EDITOR and ADMIN to create facilities", () => {
      expect(can(Role.EDITOR, "facility", "create")).toBe(true);
      expect(can(Role.ADMIN, "facility", "create")).toBe(true);
      expect(can(Role.PUBLIC, "facility", "create")).toBe(false);
    });

    it("should only allow ADMIN to manage users", () => {
      expect(can(Role.ADMIN, "user", "create")).toBe(true);
      expect(can(Role.ADMIN, "user", "update")).toBe(true);
      expect(can(Role.ADMIN, "user", "delete")).toBe(true);
      expect(can(Role.ADMIN, "user", "changeRole")).toBe(true);
      expect(can(Role.EDITOR, "user", "create")).toBe(false);
      expect(can(Role.PUBLIC, "user", "read")).toBe(false);
    });

    it("should return false for unknown resource", () => {
      expect(can(Role.ADMIN, "unknown" as "sector" | "work" | "facility" | "user", "read")).toBe(false);
    });

    it("should return false for unknown action", () => {
      expect(can(Role.ADMIN, "work", "unknown")).toBe(false);
    });
  });

  describe("canAccessWard", () => {
    it("should allow ADMIN to access any ward", () => {
      expect(canAccessWard(Role.ADMIN, "ward-1", "ward-2")).toBe(true);
      expect(canAccessWard(Role.ADMIN, null, "ward-2")).toBe(true);
      expect(canAccessWard(Role.ADMIN, "ward-1", null)).toBe(true);
    });

    it("should allow EDITOR to access their own ward", () => {
      expect(canAccessWard(Role.EDITOR, "ward-1", "ward-1")).toBe(true);
    });

    it("should deny EDITOR access to different ward", () => {
      expect(canAccessWard(Role.EDITOR, "ward-1", "ward-2")).toBe(false);
    });

    it("should deny EDITOR with no ward assignment", () => {
      expect(canAccessWard(Role.EDITOR, null, "ward-1")).toBe(false);
    });

    it("should deny PUBLIC access to any ward", () => {
      expect(canAccessWard(Role.PUBLIC, "ward-1", "ward-1")).toBe(false);
      expect(canAccessWard(Role.PUBLIC, null, "ward-1")).toBe(false);
    });
  });

  describe("PERMISSIONS object", () => {
    it("should have correct structure for sector", () => {
      expect(PERMISSIONS.sector.read).toContain(Role.PUBLIC);
      expect(PERMISSIONS.sector.read).toContain(Role.EDITOR);
      expect(PERMISSIONS.sector.read).toContain(Role.ADMIN);
      expect(PERMISSIONS.sector.update).toEqual([Role.ADMIN]);
      expect(PERMISSIONS.sector.verify).toEqual([Role.ADMIN]);
    });

    it("should have correct structure for work", () => {
      expect(PERMISSIONS.work.read).toContain(Role.PUBLIC);
      expect(PERMISSIONS.work.create).toContain(Role.EDITOR);
      expect(PERMISSIONS.work.create).toContain(Role.ADMIN);
      expect(PERMISSIONS.work.verify).toEqual([Role.ADMIN]);
    });

    it("should have correct structure for facility", () => {
      expect(PERMISSIONS.facility.read).toContain(Role.PUBLIC);
      expect(PERMISSIONS.facility.create).toContain(Role.EDITOR);
      expect(PERMISSIONS.facility.verify).toEqual([Role.ADMIN]);
    });

    it("should have correct structure for user", () => {
      expect(PERMISSIONS.user.read).toEqual([Role.ADMIN]);
      expect(PERMISSIONS.user.create).toEqual([Role.ADMIN]);
      expect(PERMISSIONS.user.changeRole).toEqual([Role.ADMIN]);
    });
  });
});