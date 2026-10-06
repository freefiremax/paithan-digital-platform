const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function run() {
  console.log('--- DATABASE CONNECTION AUDIT ---');
  try {
    // 1. Raw connectivity check
    const rawResult = await prisma.$queryRaw`SELECT 1 as connected;`;
    console.log('✅ PostgreSQL connection check (SELECT 1):', rawResult);

    // 2. Query version and current database
    const dbInfo = await prisma.$queryRaw`SELECT current_database(), current_user, version();`;
    console.log('✅ Current Database & PostgreSQL Engine info:');
    console.log('   Database name:', dbInfo[0].current_database);
    console.log('   User:', dbInfo[0].current_user);
    console.log('   Engine version:', dbInfo[0].version.split('\n')[0].substring(0, 80));

    // 3. Count records across core tables
    const [
      userCount,
      accountCount,
      sessionCount,
      adminCount,
      wardCount,
      grievanceCount,
      developmentWorkCount,
      notificationCount,
      sectorCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.account.count(),
      prisma.session.count(),
      prisma.adminUser.count(),
      prisma.ward.count(),
      prisma.grievance.count(),
      prisma.developmentWork.count(),
      prisma.notification.count(),
      prisma.civicSectorInfo.count()
    ]);

    console.log('\n--- CORE TABLES RECORD AUDIT ---');
    console.log(`✅ User table: ${userCount} records`);
    console.log(`✅ Account table (OAuth): ${accountCount} records`);
    console.log(`✅ Session table: ${sessionCount} records`);
    console.log(`✅ AdminUser table: ${adminCount} records`);
    console.log(`✅ Ward table: ${wardCount} records`);
    console.log(`✅ Grievance table: ${grievanceCount} records`);
    console.log(`✅ DevelopmentWork table: ${developmentWorkCount} records`);
    console.log(`✅ Notification table: ${notificationCount} records`);
    console.log(`✅ CivicSectorInfo table: ${sectorCount} records`);

    // 4. Inspect table columns in PostgreSQL information_schema
    const userColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      ORDER BY ordinal_position;
    `;
    console.log('\n--- USER TABLE SCHEMA AUDIT ---');
    userColumns.forEach(c => {
      console.log(`   ${c.column_name.padEnd(16)} | Type: ${c.data_type.padEnd(25)} | Nullable: ${c.is_nullable}`);
    });

    const accountColumns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Account' 
      ORDER BY ordinal_position;
    `;
    console.log('\n--- ACCOUNT TABLE SCHEMA AUDIT ---');
    accountColumns.forEach(c => {
      console.log(`   ${c.column_name.padEnd(20)} | Type: ${c.data_type}`);
    });

    // 5. Inspect Applied Migrations
    const migrations = await prisma.$queryRaw`
      SELECT migration_name, finished_at, rolled_back_at 
      FROM _prisma_migrations 
      ORDER BY started_at ASC;
    `;
    console.log('\n--- PRISMA MIGRATIONS APPLIED ---');
    migrations.forEach(m => {
      console.log(`   ${m.migration_name} | Finished: ${m.finished_at ? 'YES' : 'NO'}`);
    });

    console.log('\n✅ ALL DATABASE CHECKS PASSED.');
  } catch (err) {
    console.error('❌ Database connectivity audit failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
