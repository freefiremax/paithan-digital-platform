import { prisma } from "@/lib/db";
import { AuditAction } from "@prisma/client";
import { Prisma } from "@prisma/client";

export interface AuditLogInput {
  actorId: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  ip?: string | null;
  userAgent?: string | null;
}

export async function createAuditLog(input: AuditLogInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      before: (input.before ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      after: (input.after ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      ip: input.ip ?? null,
      userAgent: input.userAgent ?? null,
    },
  });
}

export function diffObjects<T extends Record<string, unknown>>(
  before: T | null,
  after: T | null
): Record<string, { from: unknown; to: unknown }> {
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);
  const changes: Record<string, { from: unknown; to: unknown }> = {};

  for (const key of keys) {
    const beforeVal = before?.[key];
    const afterVal = after?.[key];
    if (beforeVal !== afterVal) {
      changes[key] = { from: beforeVal, to: afterVal };
    }
  }

  return changes;
}