const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  try {
    console.log('🔧 Initializing local database...');
    
    const dbPath = path.join(process.cwd(), 'local.db');
    const client = createClient({
      url: `file:${dbPath}`,
    });

    // Read migration file
    const migrationFile = path.join(process.cwd(), 'drizzle', '0000_cynical_mephisto.sql');
    
    if (!fs.existsSync(migrationFile)) {
      console.error('❌ Migration file not found:', migrationFile);
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(migrationFile, 'utf-8');
    
    // Split by statement-breakpoint and execute each statement
    const statements = sqlContent
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
      .map(s => s.replace(/;\s*$/, ''))
      .filter(s => s.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`  Executing statement ${i + 1}/${statements.length}...`);
          await client.execute(statement);
        } catch (error) {
          // Ignore "table already exists" errors
          if (!error.message.includes('already exists')) {
            console.error(`❌ Error executing statement ${i + 1}:`, error.message);
            throw error;
          } else {
            console.log(`  ⚠️ Table already exists, skipping...`);
          }
        }
      }
    }

    console.log('✅ Database tables created successfully!');
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

initDatabase();

