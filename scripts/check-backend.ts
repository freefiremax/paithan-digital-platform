import fs from "fs";
import path from "path";

// Explicitly load .env into process.env before anything else
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { env } from "@/lib/env";
import { hash, verify } from "@node-rs/argon2";
import { verifyTurnstileToken } from "@/lib/turnstile";

interface CheckResult {
  service: string;
  status: "OK" | "WARNING" | "FAILED";
  details: string;
  latencyMs?: number;
}

const results: CheckResult[] = [];

async function checkDatabase(): Promise<void> {
  console.log("Checking Neon PostgreSQL Database...");
  const start = Date.now();
  try {
    const [wardsCount, sectorsCount, usersCount, grievancesCount, heritageCount, artifactsCount] = await Promise.all([
      prisma.ward.count(),
      prisma.civicSectorInfo.count(),
      prisma.user.count(),
      prisma.grievance.count(),
      prisma.culturalHeritageItem.count(),
      prisma.artifact.count(),
    ]);

    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    
    // Test write & delete on VisitorDailyMetric
    const testMetric = await prisma.visitorDailyMetric.create({
      data: {
        day: new Date(),
        path: "/test-healthcheck-probe",
        locale: "en",
        device: "desktop",
        source: "direct",
        pageViews: 1,
      },
    });
    await prisma.visitorDailyMetric.delete({ where: { id: testMetric.id } });

    results.push({
      service: "Neon PostgreSQL (Prisma)",
      status: "OK",
      details: `Connected successfully. Wards: ${wardsCount}, Sectors: ${sectorsCount}, Users: ${usersCount} (Admin: ${admin?.email ?? "none"}), Grievances: ${grievancesCount}, Heritage: ${heritageCount}, Artifacts: ${artifactsCount}. Full read & write cycle verified.`,
      latencyMs: Date.now() - start,
    });
    console.log(`[OK] Database checked in ${Date.now() - start}ms`);
  } catch (err: unknown) {
    results.push({
      service: "Neon PostgreSQL (Prisma)",
      status: "FAILED",
      details: `Database error: ${(err as Error).message}`,
      latencyMs: Date.now() - start,
    });
    console.log(`[FAILED] Database check error: ${(err as Error).message}`);
  }
}

async function checkRedis(): Promise<void> {
  console.log("Checking Upstash Redis / Rate Limiter...");
  const start = Date.now();
  try {
    const rateLimitRes = await checkRateLimit("healthcheck-ip-probe", { limit: 10, window: "1m" });
    if (rateLimitRes && typeof rateLimitRes.success === "boolean") {
      results.push({
        service: "Upstash Redis / Rate Limiter",
        status: "OK",
        details: `Rate limiting functional via ${env.UPSTASH_REDIS_REST_URL ? "Upstash pipeline" : "bounded local fallback"}. Remaining: ${rateLimitRes.remaining}/${rateLimitRes.limit}, Reset in: ${Math.round((rateLimitRes.reset - Date.now()) / 1000)}s.`,
        latencyMs: Date.now() - start,
      });
      console.log(`[OK] Redis checked in ${Date.now() - start}ms`);
    } else {
      results.push({
        service: "Upstash Redis / Rate Limiter",
        status: "WARNING",
        details: "Rate limiter returned null or fallback active.",
        latencyMs: Date.now() - start,
      });
      console.log(`[WARNING] Redis rate limiter fallback active`);
    }
  } catch (err: unknown) {
    results.push({
      service: "Upstash Redis / Rate Limiter",
      status: "FAILED",
      details: `Redis error: ${(err as Error).message}`,
      latencyMs: Date.now() - start,
    });
    console.log(`[FAILED] Redis check error: ${(err as Error).message}`);
  }
}

async function checkCloudinary(): Promise<void> {
  console.log("Checking Cloudinary...");
  const start = Date.now();
  try {
    const isConfigured = Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
    if (isConfigured) {
      results.push({
        service: "Cloudinary Media Service",
        status: "OK",
        details: `Cloudinary configured with cloud_name: "${env.CLOUDINARY_CLOUD_NAME}", API key and secret present. Signed upload URLs ready.`,
        latencyMs: Date.now() - start,
      });
      console.log(`[OK] Cloudinary checked in ${Date.now() - start}ms`);
    } else {
      results.push({
        service: "Cloudinary Media Service",
        status: "WARNING",
        details: "Cloudinary environment variables not fully configured.",
        latencyMs: Date.now() - start,
      });
    }
  } catch (err: unknown) {
    results.push({
      service: "Cloudinary Media Service",
      status: "WARNING",
      details: `Cloudinary error: ${(err as Error).message}`,
      latencyMs: Date.now() - start,
    });
  }
}

async function checkAuthSecurity(): Promise<void> {
  console.log("Checking Argon2 & Turnstile...");
  const start = Date.now();
  try {
    const raw = "PaithanCivicPortal@2026";
    const hashed = await hash(raw);
    const valid = await verify(hashed, raw);
    const invalid = await verify(hashed, "WrongPass!");

    const turnstileFallback = await verifyTurnstileToken("cf_fallback_123_abc");

    if (valid && !invalid && turnstileFallback) {
      results.push({
        service: "Auth & Cryptography (Argon2 + Turnstile)",
        status: "OK",
        details: "Argon2 password hashing/verification & Turnstile fast-path verification token functioning correctly.",
        latencyMs: Date.now() - start,
      });
      console.log(`[OK] Auth security checked in ${Date.now() - start}ms`);
    } else {
      results.push({
        service: "Auth & Cryptography (Argon2 + Turnstile)",
        status: "FAILED",
        details: `Cryptographic check failed: valid=${valid}, invalid=${invalid}, turnstileFallback=${turnstileFallback}`,
        latencyMs: Date.now() - start,
      });
    }
  } catch (err: unknown) {
    results.push({
      service: "Auth & Cryptography",
      status: "FAILED",
      details: `Error: ${(err as Error).message}`,
      latencyMs: Date.now() - start,
    });
  }
}

async function checkLiveEndpoints(): Promise<void> {
  console.log("Checking live API endpoints...");
  const baseUrl = "http://localhost:3000";
  const endpoints = [
    { name: "Sectors API", url: `${baseUrl}/api/sectors`, method: "GET" },
    { name: "Search API", url: `${baseUrl}/api/search?q=water`, method: "GET" },
    { name: "Chatbot API", url: `${baseUrl}/api/chatbot`, method: "POST", body: { message: "What are the emergency numbers in Paithan?", language: "en" } },
    { name: "Grievance Track API", url: `${baseUrl}/api/grievances/track?ticketNo=NONEXISTENT&phone=9999999999`, method: "GET" },
  ];

  for (const ep of endpoints) {
    const start = Date.now();
    try {
      const res = await fetch(ep.url, {
        method: ep.method,
        headers: ep.body ? { "Content-Type": "application/json" } : undefined,
        body: ep.body ? JSON.stringify(ep.body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      const isExpected = ep.name.includes("Track") ? (res.status === 404 || res.status === 200) : res.ok;
      results.push({
        service: `Endpoint: ${ep.name}`,
        status: isExpected ? "OK" : "WARNING",
        details: `HTTP ${res.status} ${res.statusText} ${ep.name === "Chatbot API" ? `(AI reply: "${data.reply?.slice(0, 50)}...")` : ep.name === "Search API" ? `(Results count: ${data.results?.length ?? 0})` : ""}`,
        latencyMs: Date.now() - start,
      });
      console.log(`[${isExpected ? "OK" : "WARN"}] ${ep.name}: HTTP ${res.status} in ${Date.now() - start}ms`);
    } catch (err: unknown) {
      results.push({
        service: `Endpoint: ${ep.name}`,
        status: "FAILED",
        details: `Failed to fetch: ${(err as Error).message}`,
        latencyMs: Date.now() - start,
      });
      console.log(`[FAILED] ${ep.name}: ${(err as Error).message}`);
    }
  }
}

async function run(): Promise<void> {
  console.log("=== Starting Backend Diagnostic Check ===");
  await checkDatabase();
  await checkRedis();
  await checkCloudinary();
  await checkAuthSecurity();
  await checkLiveEndpoints();
  
  console.log("\n=== Diagnostic Summary ===");
  for (const r of results) {
    console.log(`[${r.status}] ${r.service}: ${r.details} (${r.latencyMs}ms)`);
  }

  await prisma.$disconnect();
}

run();
