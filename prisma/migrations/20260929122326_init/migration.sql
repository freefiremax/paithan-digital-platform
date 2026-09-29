-- CreateEnum
CREATE TYPE "WorkStatus" AS ENUM ('PLANNED', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('ANNOUNCEMENT', 'SCHEME', 'TENDER', 'NOTICE');

-- CreateEnum
CREATE TYPE "HistoryEra" AS ENUM ('ANCIENT', 'HISTORICAL', 'EVENTS', 'CULTURAL', 'MODERN');

-- CreateEnum
CREATE TYPE "CulturalCategory" AS ENUM ('MANUSCRIPT', 'MONUMENT', 'TRADITION', 'ART', 'LITERATURE', 'PERSONALITY');

-- CreateEnum
CREATE TYPE "TouristCategory" AS ENUM ('JAYAKWADI', 'NATHSAGAR', 'HERITAGE_SITE', 'GENERAL');

-- CreateEnum
CREATE TYPE "RouteType" AS ENUM ('ONE_DAY', 'FAMILY', 'HERITAGE', 'NATURE', 'TEMPLE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PUBLIC', 'EDITOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "DataStatus" AS ENUM ('VERIFIED', 'SAMPLE_TBD');

-- CreateEnum
CREATE TYPE "CivicSector" AS ENUM ('ROADS_TRANSPORT', 'WATER_SANITATION', 'EDUCATION', 'HEALTH', 'OTHER_CIVIC_WORKS');

-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('SCHOOL', 'PHC', 'WATER_WORKS', 'COMMUNITY_CENTER', 'ANGANWADI', 'OTHER');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'VERIFY');

-- CreateTable
CREATE TABLE "Ward" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "boundaryGeoJSON" JSONB,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Representative" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameMr" TEXT,
    "designation" TEXT NOT NULL,
    "designationMr" TEXT,
    "photoUrl" TEXT,
    "contactInfo" JSONB,
    "wardId" TEXT,
    "bio" TEXT,
    "bioMr" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Representative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NagarSevak" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameMr" TEXT,
    "wardId" TEXT NOT NULL,
    "photoUrl" TEXT,
    "contactInfo" JSONB,
    "developmentNotes" TEXT,
    "developmentNotesMr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NagarSevak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentWork" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleMr" TEXT,
    "wardId" TEXT NOT NULL,
    "sector" "CivicSector" NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionMr" TEXT,
    "status" "WorkStatus" NOT NULL DEFAULT 'PLANNED',
    "startDate" TIMESTAMP(3),
    "expectedCompletion" TIMESTAMP(3),
    "department" TEXT NOT NULL,
    "budget" DOUBLE PRECISION,
    "progressPct" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[],
    "locationLatLng" JSONB,
    "dataStatus" "DataStatus" NOT NULL DEFAULT 'SAMPLE_TBD',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentWork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleMr" TEXT,
    "description" TEXT NOT NULL,
    "descriptionMr" TEXT,
    "estimatedBudget" DOUBLE PRECISION,
    "status" "WorkStatus" NOT NULL DEFAULT 'PLANNED',
    "department" TEXT NOT NULL,
    "timeline" TEXT,
    "location" TEXT,
    "progressPct" INTEGER NOT NULL DEFAULT 0,
    "attachments" TEXT[],
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleMr" TEXT,
    "body" TEXT NOT NULL,
    "bodyMr" TEXT,
    "category" "NotificationCategory" NOT NULL DEFAULT 'NOTICE',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuseumExhibit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameMr" TEXT,
    "description" TEXT NOT NULL,
    "descriptionMr" TEXT,
    "images" TEXT[],
    "significance" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MuseumExhibit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artifact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameMr" TEXT,
    "image" TEXT,
    "description" TEXT NOT NULL,
    "descriptionMr" TEXT,
    "period" TEXT,
    "origin" TEXT,
    "significance" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model3D" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "glbFileUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "relatedArtifactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model3D_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryEvent" (
    "id" TEXT NOT NULL,
    "era" "HistoryEra" NOT NULL,
    "title" TEXT NOT NULL,
    "titleMr" TEXT,
    "description" TEXT NOT NULL,
    "descriptionMr" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CulturalHeritageItem" (
    "id" TEXT NOT NULL,
    "category" "CulturalCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "titleMr" TEXT,
    "description" TEXT NOT NULL,
    "descriptionMr" TEXT,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CulturalHeritageItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TouristPlace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameMr" TEXT,
    "category" "TouristCategory" NOT NULL DEFAULT 'GENERAL',
    "description" TEXT NOT NULL,
    "descriptionMr" TEXT,
    "images" TEXT[],
    "locationLatLng" JSONB,
    "howToReach" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TouristPlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameMr" TEXT,
    "description" TEXT,
    "type" "RouteType" NOT NULL DEFAULT 'ONE_DAY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteStop" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "touristPlaceId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatbotChunk" (
    "id" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatbotChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PUBLIC',
    "wardId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PUBLIC',
    "wardId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CivicSectorInfo" (
    "id" TEXT NOT NULL,
    "sector" "CivicSector" NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleMr" TEXT NOT NULL,
    "taglineEn" TEXT NOT NULL,
    "taglineMr" TEXT NOT NULL,
    "overviewEn" TEXT NOT NULL,
    "overviewMr" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "contactJson" JSONB,
    "dataStatus" "DataStatus" NOT NULL DEFAULT 'SAMPLE_TBD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CivicSectorInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "sector" "CivicSector" NOT NULL,
    "type" "FacilityType" NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMr" TEXT,
    "address" TEXT NOT NULL,
    "contactJson" JSONB,
    "wardId" TEXT,
    "isOperational" BOOLEAN NOT NULL DEFAULT true,
    "dataStatus" "DataStatus" NOT NULL DEFAULT 'SAMPLE_TBD',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ward_number_key" ON "Ward"("number");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CivicSectorInfo_sector_key" ON "CivicSectorInfo"("sector");

-- AddForeignKey
ALTER TABLE "Representative" ADD CONSTRAINT "Representative_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NagarSevak" ADD CONSTRAINT "NagarSevak_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentWork" ADD CONSTRAINT "DevelopmentWork_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentWork" ADD CONSTRAINT "DevelopmentWork_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model3D" ADD CONSTRAINT "Model3D_relatedArtifactId_fkey" FOREIGN KEY ("relatedArtifactId") REFERENCES "Artifact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_touristPlaceId_fkey" FOREIGN KEY ("touristPlaceId") REFERENCES "TouristPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
