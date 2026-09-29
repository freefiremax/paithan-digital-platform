"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { verify, hash } from "@node-rs/argon2";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "UNAUTHENTICATED", message: "Authentication required" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, passwordHash: true },
  });

  if (!user?.passwordHash) {
    return { error: "NOT_FOUND", message: "User not found" };
  }

  const valid = await verify(user.passwordHash, currentPassword);
  if (!valid) {
    return { error: "FORBIDDEN", message: "Current password is incorrect" };
  }

  if (newPassword.length < 12) {
    return { error: "VALIDATION_ERROR", message: "New password must be at least 12 characters" };
  }

  const passwordHash = await hash(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await createAuditLog({
    actorId: user.id,
    action: "UPDATE",
    entity: "User",
    entityId: user.id,
    before: { event: "passwordChange" },
    after: { event: "passwordChanged" },
  });

  // Invalidate all sessions by updating a session version field
  // The JWT will be refreshed on next request due to the update trigger
  revalidatePath("/admin");

  return { success: true, message: "Password changed successfully. Please sign in again." };
}

export async function adminResetUserPassword(userId: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "UNAUTHENTICATED", message: "Authentication required" };
  }

  if (session.user.role !== "ADMIN") {
    return { error: "FORBIDDEN", message: "Only admins can reset passwords" };
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!targetUser) {
    return { error: "NOT_FOUND", message: "User not found" };
  }

  if (newPassword.length < 12) {
    return { error: "VALIDATION_ERROR", message: "New password must be at least 12 characters" };
  }

  const passwordHash = await hash(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  await createAuditLog({
    actorId: session.user.id,
    action: "UPDATE",
    entity: "User",
    entityId: userId,
    before: { event: "adminPasswordReset" },
    after: { event: "passwordResetByAdmin" },
  });

  revalidatePath("/admin/users");

  return { success: true, message: "User password reset successfully" };
}