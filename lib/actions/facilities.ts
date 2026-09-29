"use server";

import { prisma } from "@/lib/db";
import { requireAuth, canAccessFacility, canVerifyContent } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { facilityCreateSchema, facilityUpdateSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function createFacility(formData: FormData) {
  const authResult = await requireAuth(Role.EDITOR);
  const { user } = authResult;

  const rawData = {
    sector: formData.get("sector"),
    type: formData.get("type"),
    nameEn: formData.get("nameEn"),
    nameMr: formData.get("nameMr") || undefined,
    address: formData.get("address"),
    contactJson: formData.get("contactJson") ? JSON.parse(formData.get("contactJson") as string) : undefined,
    wardId: formData.get("wardId") || undefined,
    isOperational: formData.get("isOperational") === "true",
    dataStatus: formData.get("dataStatus") || "SAMPLE_TBD",
  };

  const parsed = facilityCreateSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.flatten().fieldErrors };
  }

  if (parsed.data.wardId) {
    const ward = await prisma.ward.findUnique({ where: { id: parsed.data.wardId } });
    if (!ward) {
      return { error: "NOT_FOUND", message: "Ward not found" };
    }
  }

  const createData: Prisma.FacilityCreateInput = {
    nameEn: parsed.data.nameEn,
    nameMr: parsed.data.nameMr,
    sector: parsed.data.sector,
    type: parsed.data.type,
    address: parsed.data.address,
    contactJson: (parsed.data.contactJson ?? Prisma.JsonNull) as Prisma.InputJsonValue,
    isOperational: parsed.data.isOperational,
    dataStatus: parsed.data.dataStatus,
    createdBy: { connect: { id: user.id } },
    ward: parsed.data.wardId ? { connect: { id: parsed.data.wardId } } : undefined,
  };

  const facility = await prisma.facility.create({
    data: createData,
    include: {
      ward: { select: { number: true, name: true } },
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });

  await createAuditLog({
    actorId: user.id,
    action: "CREATE",
    entity: "Facility",
    entityId: facility.id,
    after: {
      nameEn: facility.nameEn,
      nameMr: facility.nameMr,
      sector: facility.sector,
      type: facility.type,
      wardId: facility.wardId,
      isOperational: facility.isOperational,
      dataStatus: facility.dataStatus,
    },
  });

  revalidatePath("/admin/facilities");
  revalidatePath(`/services/${facility.sector.toLowerCase().replace(/_/g, "-")}`);

  return { success: true, data: facility };
}

export async function updateFacility(id: string, formData: FormData) {
  const authResult = await requireAuth(Role.EDITOR);
  const { user } = authResult;

  const canAccess = await canAccessFacility(user, id);
  if (!canAccess) {
    return { error: "FORBIDDEN", message: "Insufficient permissions to update this facility" };
  }

  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing) {
    return { error: "NOT_FOUND", message: "Facility not found" };
  }

  const rawData = {
    sector: formData.get("sector"),
    type: formData.get("type"),
    nameEn: formData.get("nameEn"),
    nameMr: formData.get("nameMr") || undefined,
    address: formData.get("address"),
    contactJson: formData.get("contactJson") ? JSON.parse(formData.get("contactJson") as string) : undefined,
    wardId: formData.get("wardId") || undefined,
    isOperational: formData.get("isOperational") === "true",
    dataStatus: formData.get("dataStatus"),
  };

  const parsed = facilityUpdateSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.flatten().fieldErrors };
  }

  if (parsed.data.dataStatus === "VERIFIED") {
    const canVerify = await canVerifyContent(user);
    if (!canVerify) {
      return { error: "FORBIDDEN", message: "Only admins can verify records" };
    }
  }

  if (parsed.data.wardId) {
    const ward = await prisma.ward.findUnique({ where: { id: parsed.data.wardId } });
    if (!ward) {
      return { error: "NOT_FOUND", message: "Ward not found" };
    }
  }

  const before = {
    nameEn: existing.nameEn,
    nameMr: existing.nameMr,
    sector: existing.sector,
    type: existing.type,
    address: existing.address,
    contactJson: existing.contactJson,
    wardId: existing.wardId,
    isOperational: existing.isOperational,
    dataStatus: existing.dataStatus,
  };

  const updateData: Prisma.FacilityUpdateInput = {};

  if (parsed.data.nameEn !== undefined) updateData.nameEn = parsed.data.nameEn;
  if (parsed.data.nameMr !== undefined) updateData.nameMr = parsed.data.nameMr;
  if (parsed.data.sector !== undefined) updateData.sector = parsed.data.sector;
  if (parsed.data.type !== undefined) updateData.type = parsed.data.type;
  if (parsed.data.address !== undefined) updateData.address = parsed.data.address;
  if (parsed.data.contactJson !== undefined) updateData.contactJson = (parsed.data.contactJson ?? Prisma.JsonNull) as Prisma.InputJsonValue;
  if (parsed.data.wardId !== undefined) updateData.ward = parsed.data.wardId ? { connect: { id: parsed.data.wardId } } : { disconnect: true };
  if (parsed.data.isOperational !== undefined) updateData.isOperational = parsed.data.isOperational;
  if (parsed.data.dataStatus !== undefined) updateData.dataStatus = parsed.data.dataStatus;

  const updated = await prisma.facility.update({
    where: { id },
    data: updateData,
    include: {
      ward: { select: { number: true, name: true } },
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });

  const after = {
    nameEn: updated.nameEn,
    nameMr: updated.nameMr,
    sector: updated.sector,
    type: updated.type,
    address: updated.address,
    contactJson: updated.contactJson,
    wardId: updated.wardId,
    isOperational: updated.isOperational,
    dataStatus: updated.dataStatus,
  };

  await createAuditLog({
    actorId: user.id,
    action: "UPDATE",
    entity: "Facility",
    entityId: updated.id,
    before,
    after,
  });

  revalidatePath("/admin/facilities");
  revalidatePath(`/services/${updated.sector.toLowerCase().replace(/_/g, "-")}`);

  return { success: true, data: updated };
}

export async function deleteFacility(id: string) {
  const authResult = await requireAuth(Role.EDITOR);
  const { user } = authResult;

  const canAccess = await canAccessFacility(user, id);
  if (!canAccess) {
    return { error: "FORBIDDEN", message: "Insufficient permissions to delete this facility" };
  }

  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing) {
    return { error: "NOT_FOUND", message: "Facility not found" };
  }

  await prisma.facility.delete({ where: { id } });

  await createAuditLog({
    actorId: user.id,
    action: "DELETE",
    entity: "Facility",
    entityId: id,
    before: {
      nameEn: existing.nameEn,
      sector: existing.sector,
      type: existing.type,
      wardId: existing.wardId,
      dataStatus: existing.dataStatus,
    },
  });

  revalidatePath("/admin/facilities");
  revalidatePath(`/services/${existing.sector.toLowerCase().replace(/_/g, "-")}`);

  return { success: true };
}

export async function verifyFacility(id: string) {
  const authResult = await requireAuth(Role.ADMIN);
  const { user } = authResult;

  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing) {
    return { error: "NOT_FOUND", message: "Facility not found" };
  }

  const before = { dataStatus: existing.dataStatus };

  const updated = await prisma.facility.update({
    where: { id },
    data: { dataStatus: "VERIFIED" },
  });

  await createAuditLog({
    actorId: user.id,
    action: "VERIFY",
    entity: "Facility",
    entityId: id,
    before,
    after: { dataStatus: updated.dataStatus },
  });

  revalidatePath("/admin/facilities");
  revalidatePath(`/services/${updated.sector.toLowerCase().replace(/_/g, "-")}`);

  return { success: true, data: updated };
}