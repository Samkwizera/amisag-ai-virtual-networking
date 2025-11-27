import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function initDatabase() {
  try {
    console.log('🔧 Initializing database...');
    
    // Check if tables exist by trying to query them
    try {
      await db.execute(sql`SELECT 1 FROM user LIMIT 1`);
      console.log('✅ Database already initialized');
      return;
    } catch {
      console.log('📝 Database is empty, creating tables...');
    }

    // Read and execute migration SQL
    const fs = await import('fs');
    const path = await import('path');
    
    const migrationFile = path.join(process.cwd(), 'drizzle', '0000_cynical_mephisto.sql');
    
    if (fs.existsSync(migrationFile)) {
      const sqlContent = fs.readFileSync(migrationFile, 'utf-8');
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (const statement of statements) {
        if (statement) {
          await db.execute(sql.raw(statement));
        }
      }
      console.log('✅ Database tables created successfully');
    } else {
      console.error('❌ Migration file not found:', migrationFile);
      console.log('💡 Try running: npx drizzle-kit generate');
    }
  } catch (error: any) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

initDatabase()
  .then(() => {
    console.log('✅ Database initialization complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  });

