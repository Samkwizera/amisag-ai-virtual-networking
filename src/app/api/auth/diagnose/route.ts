import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { user, account, session } from '@/db/schema';

export async function GET(request: NextRequest) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    checks: [],
    errors: [],
    warnings: [],
    config: {},
  };

  // Check 1: Environment Variables
  diagnostics.checks.push({
    name: "Environment Variables",
    status: "checking",
  });

  const requiredEnvVars = {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  diagnostics.config.env = {
    BETTER_AUTH_SECRET: requiredEnvVars.BETTER_AUTH_SECRET ? `✅ Set (${requiredEnvVars.BETTER_AUTH_SECRET.length} chars)` : "❌ MISSING - CRITICAL!",
    TURSO_CONNECTION_URL: requiredEnvVars.TURSO_CONNECTION_URL ? `✅ Set` : "❌ Missing",
    TURSO_AUTH_TOKEN: requiredEnvVars.TURSO_AUTH_TOKEN ? `✅ Set` : "❌ Missing",
    NEXT_PUBLIC_SITE_URL: requiredEnvVars.NEXT_PUBLIC_SITE_URL || "⚠️ Not set (will use VERCEL_URL)",
    VERCEL_URL: requiredEnvVars.VERCEL_URL || "Not set (not on Vercel)",
    VERCEL_ENV: requiredEnvVars.VERCEL_ENV || "Not set",
  };

  if (!requiredEnvVars.BETTER_AUTH_SECRET) {
    diagnostics.errors.push("BETTER_AUTH_SECRET is missing! This is CRITICAL for authentication.");
  }

  if (!requiredEnvVars.TURSO_CONNECTION_URL) {
    diagnostics.errors.push("TURSO_CONNECTION_URL is missing!");
  }

  if (!requiredEnvVars.TURSO_AUTH_TOKEN) {
    diagnostics.errors.push("TURSO_AUTH_TOKEN is missing!");
  }

  // Check 2: Base URL Configuration
  diagnostics.checks.push({
    name: "Base URL Configuration",
    status: "checking",
  });

  const requestOrigin = request.headers.get('origin') || request.headers.get('referer') || request.url;
  const expectedBaseURL = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  diagnostics.config.baseURL = {
    expected: expectedBaseURL || "Not configured",
    requestOrigin: requestOrigin,
    match: expectedBaseURL ? requestOrigin.includes(new URL(expectedBaseURL).hostname) : false,
  };

  if (!expectedBaseURL && !process.env.VERCEL_URL) {
    diagnostics.warnings.push("NEXT_PUBLIC_SITE_URL not set and VERCEL_URL not available. Auth may fail.");
  }

  // Check 3: Database Connection
  diagnostics.checks.push({
    name: "Database Connection",
    status: "checking",
  });

  try {
    await db.select().from(user).limit(1);
    diagnostics.checks[diagnostics.checks.length - 1].status = "✅ PASS";
    diagnostics.config.database = {
      connection: "✅ Connected",
    };
  } catch (dbError: any) {
    diagnostics.checks[diagnostics.checks.length - 1].status = "❌ FAIL";
    diagnostics.errors.push(`Database connection failed: ${dbError.message}`);
    diagnostics.config.database = {
      connection: "❌ Failed",
      error: dbError.message,
    };
  }

  // Check 4: Database Tables
  diagnostics.checks.push({
    name: "Database Tables",
    status: "checking",
  });

  const tables = { user: false, account: false, session: false };
  
  try {
    await db.select().from(user).limit(1);
    tables.user = true;
  } catch (e: any) {
    diagnostics.errors.push(`User table missing: ${e.message}`);
  }

  try {
    await db.select().from(account).limit(1);
    tables.account = true;
  } catch (e: any) {
    diagnostics.errors.push(`Account table missing: ${e.message}`);
  }

  try {
    await db.select().from(session).limit(1);
    tables.session = true;
  } catch (e: any) {
    diagnostics.errors.push(`Session table missing: ${e.message}`);
  }

  if (tables.user && tables.account && tables.session) {
    diagnostics.checks[diagnostics.checks.length - 1].status = "✅ PASS";
  } else {
    diagnostics.checks[diagnostics.checks.length - 1].status = "❌ FAIL";
    diagnostics.errors.push("Some required tables are missing. Run: npx drizzle-kit push");
  }

  diagnostics.config.tables = tables;

  // Check 5: Auth Configuration
  diagnostics.checks.push({
    name: "Auth Configuration",
    status: "checking",
  });

  try {
    // Get baseURL from environment (same logic as auth.ts)
    const authBaseURL = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
      (process.env.NODE_ENV === "development" ? `http://localhost:${process.env.PORT || "3000"}` : "http://localhost:3000"));
    
    // Verify auth instance is initialized
    if (!auth) {
      throw new Error("Auth instance not initialized");
    }
    
    diagnostics.config.auth = {
      baseURL: authBaseURL,
      secret: requiredEnvVars.BETTER_AUTH_SECRET ? "Set" : "Missing",
      initialized: "✅ Yes",
    };
    diagnostics.checks[diagnostics.checks.length - 1].status = "✅ PASS";
  } catch (authError: any) {
    diagnostics.checks[diagnostics.checks.length - 1].status = "❌ FAIL";
    diagnostics.errors.push(`Auth configuration error: ${authError.message}`);
    diagnostics.config.auth = {
      error: authError.message,
      initialized: "❌ No",
    };
  }

  // Check 6: User Count
  diagnostics.checks.push({
    name: "User Count",
    status: "checking",
  });

  try {
    const users = await db.select().from(user);
    diagnostics.config.users = {
      count: users.length,
      message: users.length === 0 ? "⚠️ No users found. Register a new account first!" : `✅ ${users.length} user(s) found`,
    };
    diagnostics.checks[diagnostics.checks.length - 1].status = "✅ PASS";
  } catch (e: any) {
    diagnostics.checks[diagnostics.checks.length - 1].status = "❌ FAIL";
    diagnostics.errors.push(`Could not count users: ${e.message}`);
  }

  // Summary
  const hasErrors = diagnostics.errors.length > 0;
  const hasWarnings = diagnostics.warnings.length > 0;

  diagnostics.summary = {
    status: hasErrors ? "❌ FAILED" : hasWarnings ? "⚠️ WARNINGS" : "✅ PASSED",
    errorCount: diagnostics.errors.length,
    warningCount: diagnostics.warnings.length,
  };

  return NextResponse.json(diagnostics, {
    status: hasErrors ? 500 : 200,
  });
}

