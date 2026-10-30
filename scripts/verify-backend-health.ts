import { Prisma, PrismaClient } from '@prisma/client';

// Read-only: output aggregate counts and relationship health, never citizen data.
const prisma = new PrismaClient();
async function main() {
  await prisma.$queryRaw`SELECT 1`;
  const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()`;
  const available = new Set(tables.map(row => row.table_name));
  const counts: Record<string, number> = {};
  const pending: string[] = [];
  for (const model of Prisma.dmmf.datamodel.models) {
    const name = model.dbName || model.name;
    if (!available.has(name)) { pending.push(name); continue; }
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error('Unexpected model name');
    const rows = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(`SELECT COUNT(*) AS count FROM "${name}"`);
    counts[name] = Number(rows[0].count);
  }
  const [accounts, updates, works, credentials, migrations] = await Promise.all([
    prisma.$queryRaw<Array<{ count: bigint }>>`SELECT COUNT(*) AS count FROM "Account" a LEFT JOIN "User" u ON a."userId" = u.id WHERE u.id IS NULL`,
    prisma.$queryRaw<Array<{ count: bigint }>>`SELECT COUNT(*) AS count FROM "StatusUpdate" s LEFT JOIN "Grievance" g ON s."grievanceId" = g.id WHERE g.id IS NULL`,
    prisma.$queryRaw<Array<{ count: bigint }>>`SELECT COUNT(*) AS count FROM "DevelopmentWork" w LEFT JOIN "Ward" r ON w."wardId" = r.id LEFT JOIN "User" u ON w."createdById" = u.id WHERE r.id IS NULL OR u.id IS NULL`,
    prisma.$queryRaw<Array<{ count: bigint }>>`SELECT COUNT(*) AS count FROM "User" WHERE "passwordHash" IS NOT NULL AND "passwordHash" NOT LIKE '$argon2%'`,
    prisma.$queryRaw<Array<{ count: bigint }>>`SELECT COUNT(*) AS count FROM "_prisma_migrations" WHERE finished_at IS NULL AND rolled_back_at IS NULL`,
  ]);
  const integrity = { orphanOAuthAccounts: Number(accounts[0].count), orphanGrievanceUpdates: Number(updates[0].count), orphanWorks: Number(works[0].count), nonArgonCredentialHashes: Number(credentials[0].count), unfinishedMigrations: Number(migrations[0].count) };
  const googleAccounts = await prisma.account.count({ where: { provider: 'google' } });
  const good = pending.length === 0 && Object.values(integrity).every(value => value === 0);
  console.log(JSON.stringify({ connected: true, good, tables: counts, pendingTables: pending, googleAccounts, integrity }, null, 2));
  if (!good) process.exitCode = 1;
}
main().catch(error => { console.error(JSON.stringify({ connected: false, error: error.code || error.name })); process.exitCode = 1; }).finally(() => prisma.$disconnect());
