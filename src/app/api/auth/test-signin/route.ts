import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, account } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log("🧪 Testing sign-in flow for email:", email);

    // Test 1: Check database connection
    console.log("🧪 Test 1: Database connection...");
    try {
      const testUsers = await db.select().from(user).limit(1);
      console.log("✅ Database connection: OK");
    } catch (dbError: any) {
      console.error("❌ Database connection failed:", dbError);
      return NextResponse.json({
        success: false,
        error: "Database connection failed",
        details: dbError.message,
      }, { status: 500 });
    }

    // Test 2: Check if user exists
    console.log("🧪 Test 2: Check if user exists...");
    try {
      const users = await db.select().from(user).where(eq(user.email, email)).limit(1);
      if (users.length === 0) {
        console.log("⚠️ User not found:", email);
        return NextResponse.json({
          success: false,
          error: "User not found",
          message: "No account found with this email. Please register first.",
        }, { status: 404 });
      }
      console.log("✅ User found:", users[0].id);
    } catch (userError: any) {
      console.error("❌ User lookup failed:", userError);
      return NextResponse.json({
        success: false,
        error: "User lookup failed",
        details: userError.message,
      }, { status: 500 });
    }

    // Test 3: Check account table
    console.log("🧪 Test 3: Check account table...");
    try {
      const users = await db.select().from(user).where(eq(user.email, email)).limit(1);
      if (users.length > 0) {
        const accounts = await db.select().from(account).where(eq(account.userId, users[0].id)).limit(1);
        console.log("✅ Account records:", accounts.length);
        if (accounts.length > 0) {
          console.log("✅ Account provider:", accounts[0].providerId);
          console.log("✅ Has password:", !!accounts[0].password);
        }
      }
    } catch (accountError: any) {
      console.error("❌ Account lookup failed:", accountError);
      return NextResponse.json({
        success: false,
        error: "Account lookup failed",
        details: accountError.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "All tests passed. User exists and database is working.",
    });

  } catch (error: any) {
    console.error("❌ Test sign-in error:", error);
    return NextResponse.json({
      success: false,
      error: "Test failed",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}

