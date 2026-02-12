import { prisma } from './src/config/db.js';

async function checkDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Check if tables exist and get counts
    const userCount = await prisma.user.count();
    console.log(`\n📊 Users in database: ${userCount}`);
    
    // Get all users
    const users = await prisma.user.findMany();
    console.log('\n👥 User data:');
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.name || 'No name'})`);
    });
    
    if (users.length === 0) {
      console.log('\n⚠️  No users found in database');
    }
    
  } catch (error) {
    console.error('\n❌ Database error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ Disconnected from database');
  }
}

checkDatabase();
