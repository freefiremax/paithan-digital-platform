const { PrismaClient } = require('@prisma/client');
const { hash, verify } = require('@node-rs/argon2');

const prisma = new PrismaClient();

async function runAudit() {
  console.log('==================================================');
  console.log('STARTING PRODUCTION AUTH & DATA FLOW LIVE AUDIT');
  console.log('==================================================\n');

  const testEmail = `audit.citizen.${Date.now()}@paithan-test.gov.in`;
  const testPassword = 'StrongPassword#2026';
  const testName = 'Test Citizen Auditor';
  let createdUserId = null;
  let createdGrievanceId = null;

  try {
    // -------------------------------------------------------------
    // FLOW 1: MANUAL SIGNUP -> NEON POSTGRESQL
    // -------------------------------------------------------------
    console.log('1. Testing Manual Signup Data Flow...');
    const passwordHash = await hash(testPassword);
    
    // Check password hashing validity
    if (!passwordHash.startsWith('$argon2')) {
      throw new Error('Password hash does not use Argon2 format!');
    }
    console.log('   ✅ Password securely hashed with Argon2id');

    // Create User record in Neon
    const newUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: testName,
        passwordHash: passwordHash,
        role: 'PUBLIC',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        createdAt: true,
      },
    });

    createdUserId = newUser.id;
    console.log(`   ✅ User record created in Neon (ID: ${newUser.id})`);
    console.log(`   ✅ Email: ${newUser.email}, Name: ${newUser.name}, Role: ${newUser.role}`);

    // Verify record in database
    const fetchedUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });
    if (!fetchedUser || fetchedUser.id !== createdUserId) {
      throw new Error('Failed to retrieve newly created user from Neon database!');
    }
    console.log('   ✅ Verified: User record retrieved directly from Neon PostgreSQL');

    // -------------------------------------------------------------
    // FLOW 2: DUPLICATE USER PREVENTION
    // -------------------------------------------------------------
    console.log('\n2. Testing Duplicate Registration Prevention...');
    let duplicateCaught = false;
    try {
      await prisma.user.create({
        data: {
          email: testEmail,
          name: 'Duplicate Attempt',
          passwordHash: passwordHash,
          role: 'PUBLIC',
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        duplicateCaught = true;
        console.log('   ✅ Unique constraint on email prevented duplicate user (P2002)');
      } else {
        throw err;
      }
    }
    if (!duplicateCaught) {
      throw new Error('Duplicate registration did NOT throw unique constraint error!');
    }

    // -------------------------------------------------------------
    // FLOW 3: MANUAL LOGIN VERIFICATION
    // -------------------------------------------------------------
    console.log('\n3. Testing Manual Login Flow...');
    const loginUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });
    if (!loginUser || !loginUser.passwordHash) {
      throw new Error('User not found during login lookup');
    }

    const isPasswordValid = await verify(loginUser.passwordHash, testPassword);
    if (!isPasswordValid) {
      throw new Error('Password verification failed for valid password!');
    }
    console.log('   ✅ Password verified successfully against Neon passwordHash');

    const isWrongPasswordRejected = !(await verify(loginUser.passwordHash, 'WrongPassword#999'));
    if (!isWrongPasswordRejected) {
      throw new Error('Password verification accepted invalid password!');
    }
    console.log('   ✅ Invalid password properly rejected');

    // -------------------------------------------------------------
    // FLOW 4: GOOGLE OAUTH ACCOUNT CREATION & LINKING
    // -------------------------------------------------------------
    console.log('\n4. Testing Google OAuth Account Linking Flow...');
    const googleProviderAccountId = `google-sub-${Date.now()}`;
    
    // Create Account record linked to User in Neon
    const account = await prisma.account.create({
      data: {
        userId: createdUserId,
        type: 'oauth',
        provider: 'google',
        providerAccountId: googleProviderAccountId,
        access_token: 'test_access_token',
        token_type: 'Bearer',
        scope: 'openid email profile',
      },
    });
    console.log(`   ✅ OAuth Account record created in Neon (ID: ${account.id}, Provider: ${account.provider})`);

    // Verify account relation
    const userWithAccounts = await prisma.user.findUnique({
      where: { id: createdUserId },
      include: { accounts: true },
    });
    if (!userWithAccounts?.accounts.some(a => a.providerAccountId === googleProviderAccountId)) {
      throw new Error('OAuth Account relationship failed in database!');
    }
    console.log('   ✅ Verified: User <-> Account 1:N relational link verified in Neon');

    // Verify duplicate Google account linking prevention
    let duplicateAccountCaught = false;
    try {
      await prisma.account.create({
        data: {
          userId: createdUserId,
          type: 'oauth',
          provider: 'google',
          providerAccountId: googleProviderAccountId,
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        duplicateAccountCaught = true;
        console.log('   ✅ Unique constraint on [provider, providerAccountId] prevented duplicate account (P2002)');
      }
    }
    if (!duplicateAccountCaught) {
      throw new Error('Duplicate account did not trigger unique constraint!');
    }

    // -------------------------------------------------------------
    // FLOW 5: USER PROFILE UPDATE & READ
    // -------------------------------------------------------------
    console.log('\n5. Testing Profile Update & Persistence...');
    const updatedName = 'Updated Citizen Auditor Name';
    const updatedUser = await prisma.user.update({
      where: { id: createdUserId },
      data: { name: updatedName },
    });
    if (updatedUser.name !== updatedName) {
      throw new Error('User name update did not persist!');
    }
    console.log(`   ✅ Profile updated in Neon: name -> "${updatedUser.name}"`);

    // -------------------------------------------------------------
    // FLOW 6: APPLICATION DATA PERSISTENCE (Grievances & StatusUpdates)
    // -------------------------------------------------------------
    console.log('\n6. Testing Application Data Persistence...');
    const ticketNo = `TEST-${Date.now()}`;
    const grievance = await prisma.grievance.create({
      data: {
        ticketNo: ticketNo,
        sector: 'WATER_SANITATION',
        title: 'Audit Test Grievance',
        description: 'Test description for live data flow audit',
        citizenName: testName,
        citizenPhone: '9876543210',
        citizenEmail: testEmail,
        updates: {
          create: {
            status: 'SUBMITTED',
            note: 'Initial automated audit filing',
          },
        },
      },
      include: {
        updates: true,
      },
    });

    createdGrievanceId = grievance.id;
    console.log(`   ✅ Grievance created in Neon (Ticket: ${grievance.ticketNo}, ID: ${grievance.id})`);
    console.log(`   ✅ StatusUpdate created with cascade relation (Status: ${grievance.updates[0]?.status})`);

    // Verify fetch
    const fetchedGrievance = await prisma.grievance.findUnique({
      where: { ticketNo: ticketNo },
      include: { updates: true },
    });
    if (!fetchedGrievance || fetchedGrievance.updates.length === 0) {
      throw new Error('Grievance data retrieval failed from Neon!');
    }
    console.log('   ✅ Verified: Grievance and relational updates read from Neon');

    // -------------------------------------------------------------
    // FLOW 7: CLEANUP OF TEST RECORDS
    // -------------------------------------------------------------
    console.log('\n7. Cleaning up dedicated audit test records...');
    if (createdGrievanceId) {
      await prisma.grievance.delete({ where: { id: createdGrievanceId } });
      console.log('   ✅ Deleted test grievance');
    }
    if (createdUserId) {
      await prisma.user.delete({ where: { id: createdUserId } });
      console.log('   ✅ Deleted test user and cascading account records');
    }

    console.log('\n==================================================');
    console.log('✅ ALL PRODUCTION DATA FLOWS VERIFIED SUCCESSFULLY');
    console.log('==================================================');
  } catch (error) {
    console.error('\n❌ AUDIT FAILED:', error);
    // Cleanup if partially created
    if (createdGrievanceId) {
      try { await prisma.grievance.delete({ where: { id: createdGrievanceId } }); } catch {}
    }
    if (createdUserId) {
      try { await prisma.user.delete({ where: { id: createdUserId } }); } catch {}
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runAudit();
