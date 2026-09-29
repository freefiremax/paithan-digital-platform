"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { createUserSchema, updateUserSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { hash } from "@node-rs/argon2";

export async function createUser(formData: FormData) {
  const authResult = await requireAuth(Role.ADMIN);
  const { user } = authResult;

  const rawData = {
    email: formData.get("email"),
    name: formData.get("name") || undefined,
    password: formData.get("password"),
    role: formData.get("role") || "PUBLIC",
    wardId: formData.get("wardId") || undefined,
  };

  const parsed = createUserSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "CONFLICT", message: "User with this email already exists" };
  }

  const passwordHash = await hash(parsed.data.password);

  const newUser = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
      role: parsed.data.role,
      wardId: parsed.data.wardId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      wardId: true,
      createdAt: true,
      ward: { select: { id: true, number: true, name: true } },
    },
  });

  await createAuditLog({
    actorId: user.id,
    action: "CREATE",
    entity: "User",
    entityId: newUser.id,
    after: {
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      wardId: newUser.wardId,
    },
  });

  revalidatePath("/admin/users");

  return { success: true, data: newUser };
}

export async function updateUser(id: string, formData: FormData) {
  const authResult = await requireAuth(Role.ADMIN);
  const { user } = authResult;

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    return { error: "NOT_FOUND", message: "User not found" };
  }

  const rawData = {
    name: formData.get("name") || undefined,
    password: formData.get("password") || undefined,
    role: formData.get("role") || undefined,
    wardId: formData.get("wardId") || undefined,
  };

  const parsed = updateUserSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.flatten().fieldErrors };
  }

  const before = {
    name: existing.name,
    role: existing.role,
    wardId: existing.wardId,
  };

  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.password) {
    updateData.passwordHash = await hash(parsed.data.password);
    delete updateData.password;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      wardId: true,
      createdAt: true,
      updatedAt: true,
      ward: { select: { id: true, number: true, name: true } },
    },
  });

  const after = {
    name: updated.name,
    role: updated.role,
    wardId: updated.wardId,
  };

  await createAuditLog({
    actorId: user.id,
    action: "UPDATE",
    entity: "User",
    entityId: id,
    before,
    after,
  });

  revalidatePath("/admin/users");

  return { success: true, data: updated };
}

export async function deleteUser(id: string) {
  const authResult = await requireAuth(Role.ADMIN);
  const { user } = authResult;

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    return { error: "NOT_FOUND", message: "User not found" };
  }

  if (existing.id === user.id) {
    return { error: "VALIDATION_ERROR", message: "Cannot delete your own account" };
  }

  await prisma.user.delete({ where: { id } });

  await createAuditLog({
    actorId: user.id,
    action: "DELETE",
    entity: "User",
    entityId: id,
    before: {
      email: existing.email,
      role: existing.role,
    },
  });

  revalidatePath("/admin/users");

  return { success: true };
}