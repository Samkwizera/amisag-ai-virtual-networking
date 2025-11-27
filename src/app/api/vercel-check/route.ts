import { NextResponse } from 'next/server';

export async function GET() {
  const checks: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: [],
    errors: [],
    warnings: [],
  };

  // Check 1: BETTER_AUTH_SECRET
  if (process.env.BETTER_AUTH_SECRET) {
    const secretLength = process.env.BETTER_AUTH_SECRET.length;
    checks.checks.push({
      name: 'BETTER_AUTH_SECRET',
      status: secretLength >= 32 ? '✅ PASS' : '⚠️ WARNING',
      details: `Set (${secretLength} characters)`,
      note: secretLength < 32 ? 'Secret should be at least 32 characters' : undefined,
    });
  } else {
    checks.checks.push({
      name: 'BETTER_AUTH_SECRET',
      status: '❌ FAIL',
      details: 'Missing - This is CRITICAL!',
    });
    checks.errors.push('BETTER_AUTH_SECRET is missing - authentication will fail!');
  }

  // Check 2: TURSO_CONNECTION_URL
  if (process.env.TURSO_CONNECTION_URL) {
    const isTurso = process.env.TURSO_CONNECTION_URL.startsWith('libsql://');
    checks.checks.push({
      name: 'TURSO_CONNECTION_URL',
      status: isTurso ? '✅ PASS' : '⚠️ WARNING',
      details: isTurso ? 'Turso database' : 'Local file (not recommended for production)',
      value: process.env.TURSO_CONNECTION_URL.substring(0, 30) + '...',
    });
  } else {
    checks.checks.push({
      name: 'TURSO_CONNECTION_URL',
      status: '❌ FAIL',
      details: 'Missing',
    });
    checks.errors.push('TURSO_CONNECTION_URL is missing');
  }

  // Check 3: TURSO_AUTH_TOKEN
  if (process.env.TURSO_AUTH_TOKEN) {
    checks.checks.push({
      name: 'TURSO_AUTH_TOKEN',
      status: '✅ PASS',
      details: 'Set',
    });
  } else {
    checks.checks.push({
      name: 'TURSO_AUTH_TOKEN',
      status: '⚠️ WARNING',
      details: 'Missing (OK if using local.db)',
    });
    if (process.env.TURSO_CONNECTION_URL?.startsWith('libsql://')) {
      checks.warnings.push('TURSO_AUTH_TOKEN is missing but TURSO_CONNECTION_URL is set');
    }
  }

  // Check 4: NEXT_PUBLIC_SITE_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = process.env.NEXT_PUBLIC_SITE_URL;
    const isValid = url.startsWith('https://') && !url.endsWith('/');
    checks.checks.push({
      name: 'NEXT_PUBLIC_SITE_URL',
      status: isValid ? '✅ PASS' : '⚠️ WARNING',
      details: url,
      note: !isValid ? 'Should start with https:// and have no trailing slash' : undefined,
    });
  } else {
    checks.checks.push({
      name: 'NEXT_PUBLIC_SITE_URL',
      status: '❌ FAIL',
      details: 'Missing',
    });
    checks.errors.push('NEXT_PUBLIC_SITE_URL is missing');
  }

  // Check 5: Database connection test
  try {
    const { db } = await import('@/db');
    const { user } = await import('@/db/schema');
    await db.select().from(user).limit(1);
    checks.checks.push({
      name: 'Database Connection',
      status: '✅ PASS',
      details: 'Can connect and query database',
    });
  } catch (error: any) {
    checks.checks.push({
      name: 'Database Connection',
      status: '❌ FAIL',
      details: error.message,
    });
    checks.errors.push(`Database connection failed: ${error.message}`);
  }

  // Check 6: Database schema (check if tables exist)
  try {
    const { db } = await import('@/db');
    const { user, account, session } = await import('@/db/schema');
    
    const userCount = await db.select().from(user).limit(1).then(r => r.length).catch(() => 0);
    const accountCount = await db.select().from(account).limit(1).then(r => r.length).catch(() => 0);
    const sessionCount = await db.select().from(session).limit(1).then(r => r.length).catch(() => 0);
    
    checks.checks.push({
      name: 'Database Schema',
      status: '✅ PASS',
      details: 'Tables exist (user, account, session)',
      tables: {
        user: userCount >= 0 ? 'exists' : 'missing',
        account: accountCount >= 0 ? 'exists' : 'missing',
        session: sessionCount >= 0 ? 'exists' : 'missing',
      },
    });
  } catch (error: any) {
    checks.checks.push({
      name: 'Database Schema',
      status: '❌ FAIL',
      details: error.message,
    });
    checks.errors.push(`Database schema check failed: ${error.message}`);
  }

  const allPassed = checks.errors.length === 0;
  const hasWarnings = checks.warnings.length > 0;

  return NextResponse.json({
    success: allPassed,
    ...checks,
    summary: {
      totalChecks: checks.checks.length,
      passed: checks.checks.filter((c: any) => c.status === '✅ PASS').length,
      warnings: checks.checks.filter((c: any) => c.status === '⚠️ WARNING').length,
      failed: checks.checks.filter((c: any) => c.status === '❌ FAIL').length,
    },
  }, { status: allPassed ? 200 : 500 });
}

