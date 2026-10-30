CREATE TABLE "VisitorDailyMetric" (
    "id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "path" VARCHAR(180) NOT NULL,
    "locale" VARCHAR(2) NOT NULL,
    "device" VARCHAR(10) NOT NULL,
    "source" VARCHAR(10) NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "VisitorDailyMetric_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "VisitorDailyMetric_pageViews_check" CHECK ("pageViews" >= 0)
);
CREATE UNIQUE INDEX "VisitorDailyMetric_day_path_locale_device_source_key" ON "VisitorDailyMetric"("day", "path", "locale", "device", "source");
CREATE INDEX "VisitorDailyMetric_day_idx" ON "VisitorDailyMetric"("day");
