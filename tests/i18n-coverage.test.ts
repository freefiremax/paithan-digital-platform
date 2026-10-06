import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

function getAllKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  let keys: string[] = [];
  for (const k in obj) {
    const nextPrefix = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getAllKeys(obj[k] as Record<string, unknown>, nextPrefix));
    } else {
      keys.push(nextPrefix);
    }
  }
  return keys;
}

describe("I18N Complete Translation Coverage", () => {
  const enPath = path.join(process.cwd(), "messages/en.json");
  const mrPath = path.join(process.cwd(), "messages/mr.json");
  const hiPath = path.join(process.cwd(), "messages/hi.json");

  it("should have en.json, mr.json, and hi.json files present", () => {
    expect(fs.existsSync(enPath)).toBe(true);
    expect(fs.existsSync(mrPath)).toBe(true);
    expect(fs.existsSync(hiPath)).toBe(true);
  });

  const en = JSON.parse(fs.readFileSync(enPath, "utf-8"));
  const mr = JSON.parse(fs.readFileSync(mrPath, "utf-8"));
  const hi = JSON.parse(fs.readFileSync(hiPath, "utf-8"));

  const enKeys = getAllKeys(en);
  const mrKeys = getAllKeys(mr);
  const hiKeys = getAllKeys(hi);

  it("should have zero missing keys in Marathi (mr.json)", () => {
    const missingInMr = enKeys.filter((k) => !mrKeys.includes(k));
    expect(missingInMr).toEqual([]);
    expect(mrKeys.length).toBe(enKeys.length);
  });

  it("should have zero missing keys in Hindi (hi.json)", () => {
    const missingInHi = enKeys.filter((k) => !hiKeys.includes(k));
    expect(missingInHi).toEqual([]);
    expect(hiKeys.length).toBe(enKeys.length);
  });

  it("should not contain empty translation values", () => {
    function checkNonEmpty(obj: Record<string, unknown>, locale: string) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object" && value !== null) {
          checkNonEmpty(value as Record<string, unknown>, locale);
        } else {
          expect(typeof value).toBe("string");
          expect((value as string).trim().length, `Empty string at ${key} in ${locale}`).toBeGreaterThan(0);
        }
      }
    }

    checkNonEmpty(en, "en");
    checkNonEmpty(mr, "mr");
    checkNonEmpty(hi, "hi");
  });

  it("should have required top-level namespaces in all locales", () => {
    const requiredNamespaces = [
      "header",
      "a11y",
      "nav",
      "home",
      "footer",
      "common",
      "services",
      "nagarParishad",
      "tourism",
      "heritage",
      "grievance",
      "policies",
      "search",
      "sitemap",
      "contact",
      "register",
      "login",
      "adminLogin",
      "admin",
      "chatbot",
      "adminFacilities",
      "adminSectors",
      "adminUsers",
    ];

    for (const ns of requiredNamespaces) {
      expect(en).toHaveProperty(ns);
      expect(mr).toHaveProperty(ns);
      expect(hi).toHaveProperty(ns);
    }
  });
});
