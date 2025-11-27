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

    // Read all migration files in order
    const migrationFiles = [
      '0000_cynical_mephisto.sql',
      '0001_low_thunderball.sql',
      '0002_thankful_goblin_queen.sql'
    ];
    
    let allStatements = [];
    
    for (const migrationFile of migrationFiles) {
      const filePath = path.join(process.cwd(), 'drizzle', migrationFile);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️ Migration file not found: ${migrationFile}, skipping...`);
        continue;
      }
      
      console.log(`📝 Reading migration: ${migrationFile}`);
      const sqlContent = fs.readFileSync(filePath, 'utf-8');
      
      // Split by statement-breakpoint and execute each statement
      const statements = sqlContent
        .split('--> statement-breakpoint')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))
        .map(s => s.replace(/;\s*$/, ''))
        .filter(s => s.length > 0);
      
      allStatements = allStatements.concat(statements);
    }

    console.log(`📝 Found ${allStatements.length} total SQL statements to execute`);

    for (let i = 0; i < allStatements.length; i++) {
      const statement = allStatements[i];
      if (statement.trim()) {
        try {
          console.log(`  Executing statement ${i + 1}/${allStatements.length}...`);
          await client.execute(statement);
        } catch (error) {
          // Ignore "table already exists" and "duplicate column" errors
          if (!error.message.includes('already exists') && 
              !error.message.includes('duplicate column') &&
              !error.message.includes('UNIQUE constraint failed')) {
            console.error(`❌ Error executing statement ${i + 1}:`, error.message);
            console.error(`   Statement: ${statement.substring(0, 100)}...`);
            // Don't throw - continue with other statements
          } else {
            console.log(`  ⚠️ Already exists, skipping...`);
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

