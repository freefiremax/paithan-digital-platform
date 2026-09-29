import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  wardId?: string | null;
}

export interface AuthResult {
  user: AuthUser;
}

export async function requireAuth(requiredRole?: Role): Promise<AuthResult> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHENTICATED");
  }

  const sessionUser = session.user as { id: string };
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, email: true, name: true, role: true, wardId: true },
  });

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  if (requiredRole && !hasRole(user.role, requiredRole)) {
    throw new Error("FORBIDDEN");
  }

  return { user: { ...user, role: user.role as Role } };
}

import { hasRole } from "@/lib/auth/permissions";

export async function canAccessWork(user: AuthUser, workId: string): Promise<boolean> {
  if (user.role === "ADMIN") return true;

  const work = await prisma.developmentWork.findUnique({
    where: { id: workId },
    select: { createdById: true, wardId: true },
  });

  if (!work) return false;

  if (work.createdById === user.id) return true;
  if (user.role === "EDITOR" && user.wardId && work.wardId === user.wardId) return true;

  return false;
}

export async function canAccessFacility(user: AuthUser, facilityId: string): Promise<boolean> {
  if (user.role === "ADMIN") return true;

  const facility = await prisma.facility.findUnique({
    where: { id: facilityId },
    select: { createdById: true, wardId: true },
  });

  if (!facility) return false;

  if (facility.createdById === user.id) return true;
  if (user.role === "EDITOR" && user.wardId && facility.wardId === user.wardId) return true;

  return false;
}

export async function canVerifyContent(user: AuthUser): Promise<boolean> {
  return user.role === "ADMIN";
}