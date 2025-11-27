#!/usr/bin/env node

/**
 * Run authentication diagnostics
 * Usage: node scripts/run-diagnostics.js [url]
 * Example: node scripts/run-diagnostics.js http://localhost:3001
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const url = process.argv[2] || 'http://localhost:3001';
const diagnosticUrl = `${url}/api/auth/diagnose`;

console.log('\n🔍 Running Authentication Diagnostics...\n');
console.log(`📍 URL: ${diagnosticUrl}\n`);

function makeRequest(urlString) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(urlString);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Diagnostic-Script',
      },
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: { error: 'Invalid JSON', raw: data } });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runDiagnostics() {
  try {
    const result = await makeRequest(diagnosticUrl);
    
    if (result.status !== 200 && result.status !== 500) {
      console.error(`❌ Server responded with status ${result.status}`);
      console.error('Response:', result.data);
      process.exit(1);
    }

    const diagnostics = result.data;

    // Print summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 DIAGNOSTIC RESULTS');
    console.log('═══════════════════════════════════════════════════════\n');

    const statusColor = diagnostics.summary.status.includes('FAILED') ? '❌' : 
                       diagnostics.summary.status.includes('WARNINGS') ? '⚠️' : '✅';
    console.log(`${statusColor} Status: ${diagnostics.summary.status}`);
    console.log(`   Errors: ${diagnostics.summary.errorCount}`);
    console.log(`   Warnings: ${diagnostics.summary.warningCount}\n`);

    // Print checks
    console.log('📋 Checks:');
    diagnostics.checks.forEach((check, index) => {
      const icon = check.status.includes('PASS') ? '✅' : 
                   check.status.includes('FAIL') ? '❌' : '⏳';
      console.log(`   ${index + 1}. ${icon} ${check.name}: ${check.status}`);
    });
    console.log('');

    // Print environment variables
    if (diagnostics.config.env) {
      console.log('🔐 Environment Variables:');
      Object.entries(diagnostics.config.env).forEach(([key, value]) => {
        const icon = String(value).includes('MISSING') || String(value).includes('Missing') ? '❌' :
                     String(value).includes('Set') || String(value).includes('✅') ? '✅' : '⚠️';
        console.log(`   ${icon} ${key}: ${value}`);
      });
      console.log('');
    }

    // Print database info
    if (diagnostics.config.database) {
      console.log('🗄️  Database:');
      console.log(`   Connection: ${diagnostics.config.database.connection}`);
      if (diagnostics.config.database.error) {
        console.log(`   Error: ${diagnostics.config.database.error}`);
      }
      console.log('');
    }

    // Print tables
    if (diagnostics.config.tables) {
      console.log('📊 Tables:');
      Object.entries(diagnostics.config.tables).forEach(([table, exists]) => {
        const icon = exists ? '✅' : '❌';
        console.log(`   ${icon} ${table}: ${exists ? 'Exists' : 'Missing'}`);
      });
      console.log('');
    }

    // Print auth config
    if (diagnostics.config.auth) {
      console.log('🔑 Auth Configuration:');
      Object.entries(diagnostics.config.auth).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
      console.log('');
    }

    // Print users
    if (diagnostics.config.users) {
      console.log('👥 Users:');
      console.log(`   ${diagnostics.config.users.message}`);
      console.log(`   Count: ${diagnostics.config.users.count}`);
      console.log('');
    }

    // Print errors
    if (diagnostics.errors && diagnostics.errors.length > 0) {
      console.log('❌ Errors:');
      diagnostics.errors.forEach((error) => {
        console.log(`   • ${error}`);
      });
      console.log('');
    }

    // Print warnings
    if (diagnostics.warnings && diagnostics.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      diagnostics.warnings.forEach((warning) => {
        console.log(`   • ${warning}`);
      });
      console.log('');
    }

    // Print recommendations
    console.log('═══════════════════════════════════════════════════════');
    if (diagnostics.errors.length > 0) {
      console.log('\n🔧 Recommendations:');
      if (diagnostics.errors.some(e => e.includes('BETTER_AUTH_SECRET'))) {
        console.log('   1. Add BETTER_AUTH_SECRET to Vercel environment variables');
        console.log('      Generate: https://generate-secret.vercel.app/32');
      }
      if (diagnostics.errors.some(e => e.includes('tables are missing'))) {
        console.log('   2. Run: npx drizzle-kit push');
      }
      if (diagnostics.errors.some(e => e.includes('Database connection'))) {
        console.log('   3. Check TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN');
      }
      if (diagnostics.config.users && diagnostics.config.users.count === 0) {
        console.log('   4. Register a new account (users from localhost don\'t exist in production)');
      }
      console.log('');
    } else {
      console.log('\n✅ All checks passed! Authentication should be working.\n');
    }

    // Exit with appropriate code
    process.exit(diagnostics.errors.length > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ Error running diagnostics:');
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      console.log('💡 Tips:');
      console.log('   • Make sure the dev server is running');
      console.log('   • Check the URL is correct');
      console.log('   • For Vercel, use: https://your-app.vercel.app/api/auth/diagnose\n');
    }
    
    process.exit(1);
  }
}

runDiagnostics();

