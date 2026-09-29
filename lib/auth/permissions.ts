import { Role, CivicSector, FacilityType } from "@prisma/client";

export const ROLE_HIERARCHY: Record<Role, number> = {
  PUBLIC: 0,
  EDITOR: 1,
  ADMIN: 2,
};

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export const PERMISSIONS = {
  // Sector permissions
  sector: {
    read: ["PUBLIC", "EDITOR", "ADMIN"] as Role[],
    update: ["ADMIN"] as Role[],
    verify: ["ADMIN"] as Role[],
  },
  // Development work permissions
  work: {
    read: ["PUBLIC", "EDITOR", "ADMIN"] as Role[],
    create: ["EDITOR", "ADMIN"] as Role[],
    update: ["EDITOR", "ADMIN"] as Role[],
    delete: ["EDITOR", "ADMIN"] as Role[],
    verify: ["ADMIN"] as Role[],
  },
  // Facility permissions
  facility: {
    read: ["PUBLIC", "EDITOR", "ADMIN"] as Role[],
    create: ["EDITOR", "ADMIN"] as Role[],
    update: ["EDITOR", "ADMIN"] as Role[],
    delete: ["EDITOR", "ADMIN"] as Role[],
    verify: ["ADMIN"] as Role[],
  },
  // User permissions
  user: {
    read: ["ADMIN"] as Role[],
    create: ["ADMIN"] as Role[],
    update: ["ADMIN"] as Role[],
    delete: ["ADMIN"] as Role[],
    changeRole: ["ADMIN"] as Role[],
  },
} as const;

export function can(userRole: Role, resource: keyof typeof PERMISSIONS, action: string): boolean {
  const resourcePerms = PERMISSIONS[resource];
  if (!resourcePerms) return false;
  const allowedRoles = resourcePerms[action as keyof typeof resourcePerms];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
}

export function canAccessWard(userRole: Role, userWardId: string | null | undefined, targetWardId: string | null | undefined): boolean {
  if (userRole === "ADMIN") return true;
  if (userRole === "EDITOR" && userWardId && targetWardId && userWardId === targetWardId) return true;
  return false;
}

export const SECTOR_SLUG_MAP: Record<CivicSector, string> = {
  ROADS_TRANSPORT: "roads-transport",
  WATER_SANITATION: "water-sanitation",
  EDUCATION: "education",
  HEALTH: "health",
  OTHER_CIVIC_WORKS: "other-civic-works",
};

export const SECTOR_LABELS_EN: Record<CivicSector, string> = {
  ROADS_TRANSPORT: "Roads & Transport",
  WATER_SANITATION: "Water & Sanitation",
  EDUCATION: "Education",
  HEALTH: "Health",
  OTHER_CIVIC_WORKS: "Other Civic Works",
};

export const SECTOR_LABELS_MR: Record<CivicSector, string> = {
  ROADS_TRANSPORT: "रस्ते व वाहतूक",
  WATER_SANITATION: "पाणी व स्वच्छता",
  EDUCATION: "शिक्षण",
  HEALTH: "आरोग्य",
  OTHER_CIVIC_WORKS: "इतर नागरी कामे",
};

export const FACILITY_TYPE_LABELS_EN: Record<FacilityType, string> = {
  SCHOOL: "School",
  PHC: "Primary Health Center",
  WATER_WORKS: "Water Works",
  COMMUNITY_CENTER: "Community Center",
  ANGANWADI: "Anganwadi",
  OTHER: "Other",
};

export const FACILITY_TYPE_LABELS_MR: Record<FacilityType, string> = {
  SCHOOL: "शाळा",
  PHC: "प्राथमिक आरोग्य केंद्र",
  WATER_WORKS: "पाणीपुरवठा केंद्र",
  COMMUNITY_CENTER: "समुदाय केंद्र",
  ANGANWADI: "आंगणवाडी",
  OTHER: "इतर",
};

export function getSectorFromSlug(slug: string): CivicSector | null {
  const entry = Object.entries(SECTOR_SLUG_MAP).find(([, v]) => v === slug);
  return entry ? (entry[0] as CivicSector) : null;
}

export function getSlugFromSector(sector: CivicSector): string {
  return SECTOR_SLUG_MAP[sector];
}