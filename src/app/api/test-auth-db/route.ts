import { NextResponse } from 'next/server';
import { db } from '@/db';
import { user, account, session } from '@/db/schema';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: [],
    errors: [],
  };

  // Test 1: Database connection
  try {
    console.log("🧪 Test 1: Database connection...");
    await db.select().from(user).limit(1);
    results.tests.push({ name: "Database connection", status: "✅ PASS" });
  } catch (error: any) {
    results.tests.push({ name: "Database connection", status: "❌ FAIL", error: error.message });
    results.errors.push(`Database connection failed: ${error.message}`);
    console.error("❌ Database connection test failed:", error);
  }

  // Test 2: User table exists
  try {
    console.log("🧪 Test 2: User table...");
    const users = await db.select().from(user).limit(1);
    results.tests.push({ name: "User table", status: "✅ PASS", count: users.length });
  } catch (error: any) {
    results.tests.push({ name: "User table", status: "❌ FAIL", error: error.message });
    results.errors.push(`User table test failed: ${error.message}`);
    console.error("❌ User table test failed:", error);
  }

  // Test 3: Account table exists
  try {
    console.log("🧪 Test 3: Account table...");
    const accounts = await db.select().from(account).limit(1);
    results.tests.push({ name: "Account table", status: "✅ PASS", count: accounts.length });
  } catch (error: any) {
    results.tests.push({ name: "Account table", status: "❌ FAIL", error: error.message });
    results.errors.push(`Account table test failed: ${error.message}`);
    console.error("❌ Account table test failed:", error);
  }

  // Test 4: Session table exists
  try {
    console.log("🧪 Test 4: Session table...");
    const sessions = await db.select().from(session).limit(1);
    results.tests.push({ name: "Session table", status: "✅ PASS", count: sessions.length });
  } catch (error: any) {
    results.tests.push({ name: "Session table", status: "❌ FAIL", error: error.message });
    results.errors.push(`Session table test failed: ${error.message}`);
    console.error("❌ Session table test failed:", error);
  }

  // Test 5: Check environment variables
  results.env = {
    TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL ? "✅ Set" : "❌ Missing",
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? "✅ Set" : "❌ Missing",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "❌ Missing",
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? "✅ Set" : "❌ Missing",
  };

  const allPassed = results.tests.every((t: any) => t.status === "✅ PASS");
  
  return NextResponse.json({
    success: allPassed,
    ...results,
  }, { status: allPassed ? 200 : 500 });
}

