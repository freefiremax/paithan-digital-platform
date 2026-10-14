import { NextRequest } from "next/server";
import { POST } from "../app/api/chatbot/route";
import { prisma } from "../lib/db";

// Explicit live check, separate from normal CI. Uses provider quota and no user records.
async function main() {
  const cases = [
    { message: "will you help me to knwo the cluture of paithan", language: "en" },
    { message: "पैठण संस्कृती", language: "mr" },
    { message: "paithan sanskriti", language: "hi" },
    { message: "tell me about jaikwadi bird", language: "en" },
    { message: "What is photosynthesis?", language: "en" },
  ];
  for (const item of cases) {
    const started = Date.now();
    const response = await POST(new NextRequest("http://localhost/api/chatbot", { method: "POST", body: JSON.stringify(item), headers: { "x-forwarded-for": "chatbot-live-check" } }));
    const data = await response.json();
    console.log(JSON.stringify({ ...item, status: response.status, engine: data.engine, reply: data.reply, sources: data.sources, latencyMs: Date.now() - started }));
    if (response.status !== 200 || !data.reply || (item.message.includes("photosynthesis") && data.engine === "local-fallback")) process.exitCode = 1;
  }
}
main().catch(() => { console.error("Live chatbot verification failed."); process.exitCode = 1; }).finally(() => prisma.$disconnect());
