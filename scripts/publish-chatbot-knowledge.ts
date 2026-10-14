import { persistPublicKnowledge } from "../lib/chatbot/public-data";
import { prisma } from "../lib/db";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for knowledge publishing");
  console.log(JSON.stringify(await persistPublicKnowledge(), null, 2));
}
main().catch(() => { console.error("Knowledge publish failed; check DB connectivity and public-data diagnostics."); process.exitCode = 1; }).finally(() => prisma.$disconnect());
