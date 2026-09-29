"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { civicSectorInfoUpdateSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { getSectorFromSlug } from "@/lib/auth/permissions";
import { Prisma } from "@prisma/client";

export async function updateSectorInfo(sectorSlug: string, formData: FormData) {
  const authResult = await requireAuth(Role.ADMIN);
  const { user } = authResult;

  const sector = getSectorFromSlug(sectorSlug);
  if (!sector) {
    return { error: "NOT_FOUND", message: "Sector not found" };
  }

  const rawData = {
    titleEn: formData.get("titleEn") || undefined,
    titleMr: formData.get("titleMr") || undefined,
    taglineEn: formData.get("taglineEn") || undefined,
    taglineMr: formData.get("taglineMr") || undefined,
    overviewEn: formData.get("overviewEn") || undefined,
    overviewMr: formData.get("overviewMr") || undefined,
    department: formData.get("department") || undefined,
    contactJson: formData.get("contactJson") ? JSON.parse(formData.get("contactJson") as string) : undefined,
    dataStatus: formData.get("dataStatus") || undefined,
  };

  const parsed = civicSectorInfoUpdateSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.civicSectorInfo.findUnique({ where: { sector } });
  if (!existing) {
    return { error: "NOT_FOUND", message: "Sector info not found" };
  }

  const before = {
    titleEn: existing.titleEn,
    titleMr: existing.titleMr,
    taglineEn: existing.taglineEn,
    taglineMr: existing.taglineMr,
    overviewEn: existing.overviewEn,
    overviewMr: existing.overviewMr,
    department: existing.department,
    contactJson: existing.contactJson,
    dataStatus: existing.dataStatus,
  };

  const updateData: Record<string, unknown> = { ...parsed.data };
  if (updateData.contactJson !== undefined) {
    updateData.contactJson = updateData.contactJson as Prisma.InputJsonValue;
  }

  const updated = await prisma.civicSectorInfo.update({
    where: { sector },
    data: updateData,
  });

  const after = {
    titleEn: updated.titleEn,
    titleMr: updated.titleMr,
    taglineEn: updated.taglineEn,
    taglineMr: updated.taglineMr,
    overviewEn: updated.overviewEn,
    overviewMr: updated.overviewMr,
    department: updated.department,
    contactJson: updated.contactJson,
    dataStatus: updated.dataStatus,
  };

  await createAuditLog({
    actorId: user.id,
    action: "UPDATE",
    entity: "CivicSectorInfo",
    entityId: updated.id,
    before,
    after,
  });

  revalidatePath("/admin/sectors");
  revalidatePath(`/services/${sectorSlug}`);

  return { success: true, data: updated };
}