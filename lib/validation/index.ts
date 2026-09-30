import { z } from "zod";

export const civicSectorEnum = z.enum([
  "ROADS_TRANSPORT",
  "WATER_SANITATION",
  "EDUCATION",
  "HEALTH",
  "OTHER_CIVIC_WORKS",
]);

export const facilityTypeEnum = z.enum([
  "SCHOOL",
  "PHC",
  "WATER_WORKS",
  "COMMUNITY_CENTER",
  "ANGANWADI",
  "OTHER",
]);

export const workStatusEnum = z.enum(["PLANNED", "ONGOING", "COMPLETED"]);
export const dataStatusEnum = z.enum(["VERIFIED", "SAMPLE_TBD"]);
export const roleEnum = z.enum(["PUBLIC", "EDITOR", "ADMIN"]);

export const grievanceStatusEnum = z.enum(["SUBMITTED", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED", "REJECTED"]);

export const sectorSlugParamSchema = z.object({
  sector: civicSectorEnum,
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const civicSectorInfoUpdateSchema = z.object({
  titleEn: z.string().min(1).max(200).optional(),
  titleMr: z.string().min(1).max(200).optional(),
  taglineEn: z.string().min(1).max(300).optional(),
  taglineMr: z.string().min(1).max(300).optional(),
  overviewEn: z.string().min(1).max(5000).optional(),
  overviewMr: z.string().min(1).max(5000).optional(),
  department: z.string().min(1).max(200).optional(),
  contactJson: z.record(z.string(), z.unknown()).optional(),
  dataStatus: dataStatusEnum.optional(),
}).strict();

export const developmentWorkCreateSchema = z.object({
  title: z.string().min(1).max(200),
  titleMr: z.string().max(200).optional(),
  wardId: z.string().cuid(),
  sector: civicSectorEnum,
  description: z.string().min(1).max(5000),
  descriptionMr: z.string().max(5000).optional(),
  status: workStatusEnum.default("PLANNED"),
  startDate: z.string().datetime().optional().nullable(),
  expectedCompletion: z.string().datetime().optional().nullable(),
  department: z.string().min(1).max(200),
  budget: z.number().nonnegative().optional().nullable(),
  progressPct: z.number().int().min(0).max(100).default(0),
  images: z.array(z.string().url()).default([]),
  locationLatLng: z.record(z.string(), z.unknown()).optional().nullable(),
  dataStatus: dataStatusEnum.default("SAMPLE_TBD"),
}).strict();

export const developmentWorkUpdateSchema = developmentWorkCreateSchema.partial().strict();

export const developmentWorkQuerySchema = paginationSchema.extend({
  wardId: z.string().cuid().optional(),
  sector: civicSectorEnum.optional(),
  status: workStatusEnum.optional(),
  dataStatus: dataStatusEnum.optional(),
  search: z.string().max(100).optional(),
}).strict();

export const facilityCreateSchema = z.object({
  sector: civicSectorEnum,
  type: facilityTypeEnum,
  nameEn: z.string().min(1).max(200),
  nameMr: z.string().max(200).optional(),
  address: z.string().min(1).max(500),
  contactJson: z.record(z.string(), z.unknown()).optional().nullable(),
  wardId: z.string().cuid().optional().nullable(),
  isOperational: z.boolean().default(true),
  dataStatus: dataStatusEnum.default("SAMPLE_TBD"),
}).strict();

export const facilityUpdateSchema = facilityCreateSchema.partial().strict();

export const facilityQuerySchema = paginationSchema.extend({
  wardId: z.string().cuid().optional(),
  sector: civicSectorEnum.optional(),
  type: facilityTypeEnum.optional(),
  dataStatus: dataStatusEnum.optional(),
  isOperational: z.boolean().optional(),
  search: z.string().max(100).optional(),
}).strict();

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
}).strict();

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100).optional(),
  password: z.string().min(12).max(128),
  role: roleEnum.default("PUBLIC"),
  wardId: z.string().cuid().optional().nullable(),
}).strict();

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  password: z.string().min(12).max(128).optional(),
  role: roleEnum.optional(),
  wardId: z.string().cuid().optional().nullable(),
}).strict();

export const verifyContentSchema = z.object({
  dataStatus: z.literal("VERIFIED"),
}).strict();

export const grievanceCreateSchema = z.object({
  sector: civicSectorEnum,
  wardId: z.string().cuid().optional().nullable(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  citizenName: z.string().min(1).max(100),
  citizenPhone: z.string().min(10).max(15).regex(/^[\d\s\-\+\(\)]+$/),
  citizenEmail: z.string().email().optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  turnstileToken: z.string().min(1),
}).strict();

export const grievanceTrackSchema = z.object({
  ticketNo: z.string().min(1).max(50),
  phone: z.string().min(10).max(15).regex(/^[\d\s\-\+\(\)]+$/),
}).strict();

export const grievanceStatusUpdateSchema = z.object({
  status: grievanceStatusEnum,
  note: z.string().max(2000).optional().nullable(),
}).strict();

export const grievanceQuerySchema = paginationSchema.extend({
  status: grievanceStatusEnum.optional(),
  sector: civicSectorEnum.optional(),
  wardId: z.string().cuid().optional(),
  search: z.string().max(100).optional(),
}).strict();

export const contactFormSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15).regex(/^[\d\s\-\+\(\)]+$/).optional().nullable(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  turnstileToken: z.string().min(1),
}).strict();