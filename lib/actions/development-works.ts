"use server";

import { prisma } from "@/lib/db";
import { requireAuth, canAccessWork, canVerifyContent } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { developmentWorkCreateSchema, developmentWorkUpdateSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function createDevelopmentWork(formData: FormData) {
  const authResult = await requireAuth(Role.EDITOR);
  const { user } = authResult;

  const rawData = {
    title: formData.get("title"),
    titleMr: formData.get("titleMr") || undefined,
    wardId: formData.get("wardId"),
    sector: formData.get("sector"),
    description: formData.get("description"),
    descriptionMr: formData.get("descriptionMr") || undefined,
    status: formData.get("status") || "PLANNED",
    startDate: formData.get("startDate") || undefined,
    expectedCompletion: formData.get("expectedCompletion") || undefined,
    department: formData.get("department"),
    budget: formData.get("budget") ? parseFloat(formData.get("budget") as string) : undefined,
    progressPct: formData.get("progressPct") ? parseInt(formData.get("progressPct") as string, 10) : 0,
    images: formData.get("images") ? JSON.parse(formData.get("images") as string) : [],
    locationLatLng: formData.get("locationLatLng") ? JSON.parse(formData.get("locationLatLng") as string) : undefined,
    dataStatus: formData.get("dataStatus") || "SAMPLE_TBD",
  };

  const parsed = developmentWorkCreateSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.flatten().fieldErrors };
  }

  const ward = await prisma.ward.findUnique({ where: { id: parsed.data.wardId } });
  if (!ward) {
    return { error: "NOT_FOUND", message: "Ward not found" };
  }

  const createData: Prisma.DevelopmentWorkCreateInput = {
    title: parsed.data.title,
    titleMr: parsed.data.titleMr,
    ward: { connect: { id: parsed.data.wardId } },
    sector: parsed.data.sector,
    description: parsed.data.description,
    descriptionMr: parsed.data.descriptionMr,
    status: parsed.data.status,
    startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
    expectedCompletion: parsed.data.expectedCompletion ? new Date(parsed.data.expectedCompletion) : null,
    department: parsed.data.department,
    budget: parsed.data.budget,
    progressPct: parsed.data.progressPct,
    images: parsed.data.images,
    locationLatLng: (parsed.data.locationLatLng ?? Prisma.JsonNull) as Prisma.InputJsonValue,
    dataStatus: parsed.data.dataStatus,
    createdBy: { connect: { id: user.id } },
  };

  const work = await prisma.developmentWork.create({
    data: createData,
    include: {
      ward: { select: { number: true, name: true } },
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });

  await createAuditLog({
    actorId: user.id,
    action: "CREATE",
    entity: "DevelopmentWork",
    entityId: work.id,
    after: {
      title: work.title,
      sector: work.sector,
      wardId: work.wardId,
      status: work.status,
      budget: work.budget,
      progressPct: work.progressPct,
      dataStatus: work.dataStatus,
    },
  });

  revalidatePath("/admin/development-works");
  revalidatePath(`/services/${work.sector.toLowerCase().replace(/_/g, "-")}`);

  return { success: true, data: work };
}

export async function updateDevelopmentWork(id: string, formData: FormData) {
  const authResult = await requireAuth(Role.EDITOR);
  const { user } = authResult;

  const canAccess = await canAccessWork(user, id);
  if (!canAccess) {
    return { error: "FORBIDDEN", message: "Insufficient permissions to update this work" };
  }

  const existing = await prisma.developmentWork.findUnique({ where: { id } });
  if (!existing) {
    return { error: "NOT_FOUND", message: "Development work not found" };
  }

  const rawData = {
    title: formData.get("title"),
    titleMr: formData.get("titleMr") || undefined,
    description: formData.get("description"),
    descriptionMr: formData.get("descriptionMr") || undefined,
    status: formData.get("status"),
    startDate: formData.get("startDate") || undefined,
    expectedCompletion: formData.get("expectedCompletion") || undefined,
    department: formData.get("department"),
    budget: formData.get("budget") ? parseFloat(formData.get("budget") as string) : undefined,
    progressPct: formData.get("progressPct") ? parseInt(formData.get("progressPct") as string, 10) : undefined,
    images: formData.get("images") ? JSON.parse(formData.get("images") as string) : undefined,
    locationLatLng: formData.get("locationLatLng") ? JSON.parse(formData.get("locationLatLng") as string) : undefined,
    dataStatus: formData.get("dataStatus"),
    wardId: formData.get("wardId") || undefined,
  };

  const parsed = developmentWorkUpdateSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.flatten().fieldErrors };
  }

  if (parsed.data.dataStatus === "VERIFIED") {
    const canVerify = await canVerifyContent(user);
    if (!canVerify) {
      return { error: "FORBIDDEN", message: "Only admins can verify records" };
    }
  }

  const before = {
    title: existing.title,
    titleMr: existing.titleMr,
    wardId: existing.wardId,
    sector: existing.sector,
    description: existing.description,
    descriptionMr: existing.descriptionMr,
    status: existing.status,
    startDate: existing.startDate?.toISOString() ?? null,
    expectedCompletion: existing.expectedCompletion?.toISOString() ?? null,
    department: existing.department,
    budget: existing.budget,
    progressPct: existing.progressPct,
    images: existing.images,
    locationLatLng: existing.locationLatLng,
    dataStatus: existing.dataStatus,
  };

  const updateData: Prisma.DevelopmentWorkUpdateInput = {};

  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.titleMr !== undefined) updateData.titleMr = parsed.data.titleMr;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
  if (parsed.data.descriptionMr !== undefined) updateData.descriptionMr = parsed.data.descriptionMr;
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
  if (parsed.data.startDate !== undefined) updateData.startDate = parsed.data.startDate ? new Date(parsed.data.startDate) : null;
  if (parsed.data.expectedCompletion !== undefined) updateData.expectedCompletion = parsed.data.expectedCompletion ? new Date(parsed.data.expectedCompletion) : null;
  if (parsed.data.department !== undefined) updateData.department = parsed.data.department;
  if (parsed.data.budget !== undefined) updateData.budget = parsed.data.budget;
  if (parsed.data.progressPct !== undefined) updateData.progressPct = parsed.data.progressPct;
  if (parsed.data.images !== undefined) updateData.images = parsed.data.images;
  if (parsed.data.locationLatLng !== undefined) updateData.locationLatLng = (parsed.data.locationLatLng ?? Prisma.JsonNull) as Prisma.InputJsonValue;
  if (parsed.data.dataStatus !== undefined) updateData.dataStatus = parsed.data.dataStatus;
  if (parsed.data.wardId !== undefined) updateData.ward = { connect: { id: parsed.data.wardId } };

  const updated = await prisma.developmentWork.update({
    where: { id },
    data: updateData,
    include: {
      ward: { select: { number: true, name: true } },
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });

  const after = {
    title: updated.title,
    titleMr: updated.titleMr,
    wardId: updated.wardId,
    sector: updated.sector,
    description: updated.description,
    descriptionMr: updated.descriptionMr,
    status: updated.status,
    startDate: updated.startDate?.toISOString() ?? null,
    expectedCompletion: updated.expectedCompletion?.toISOString() ?? null,
    department: updated.department,
    budget: updated.budget,
    progressPct: updated.progressPct,
    images: updated.images,
    locationLatLng: updated.locationLatLng,
    dataStatus: updated.dataStatus,
  };

  await createAuditLog({
    actorId: user.id,
    action: "UPDATE",
    entity: "DevelopmentWork",
    entityId: updated.id,
    before,
    after,
  });

  revalidatePath("/admin/development-works");
  revalidatePath(`/services/${updated.sector.toLowerCase().replace(/_/g, "-")}`);

  return { success: true, data: updated };
}

export async function deleteDevelopmentWork(id: string) {
  const authResult = await requireAuth(Role.EDITOR);
  const { user } = authResult;

  const canAccess = await canAccessWork(user, id);
  if (!canAccess) {
    return { error: "FORBIDDEN", message: "Insufficient permissions to delete this work" };
  }

  const existing = await prisma.developmentWork.findUnique({ where: { id } });
  if (!existing) {
    return { error: "NOT_FOUND", message: "Development work not found" };
  }

  await prisma.developmentWork.delete({ where: { id } });

  await createAuditLog({
    actorId: user.id,
    action: "DELETE",
    entity: "DevelopmentWork",
    entityId: id,
    before: {
      title: existing.title,
      sector: existing.sector,
      wardId: existing.wardId,
      status: existing.status,
      budget: existing.budget,
      dataStatus: existing.dataStatus,
    },
  });

  revalidatePath("/admin/development-works");
  revalidatePath(`/services/${existing.sector.toLowerCase().replace(/_/g, "-")}`);

  return { success: true };
}

export async function verifyDevelopmentWork(id: string) {
  const authResult = await requireAuth(Role.ADMIN);
  const { user } = authResult;

  const existing = await prisma.developmentWork.findUnique({ where: { id } });
  if (!existing) {
    return { error: "NOT_FOUND", message: "Development work not found" };
  }

  const before = { dataStatus: existing.dataStatus };

  const updated = await prisma.developmentWork.update({
    where: { id },
    data: { dataStatus: "VERIFIED" },
  });

  await createAuditLog({
    actorId: user.id,
    action: "VERIFY",
    entity: "DevelopmentWork",
    entityId: id,
    before,
    after: { dataStatus: updated.dataStatus },
  });

  revalidatePath("/admin/development-works");
  revalidatePath(`/services/${updated.sector.toLowerCase().replace(/_/g, "-")}`);

  return { success: true, data: updated };
}