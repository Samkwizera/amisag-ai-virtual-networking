import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

// Wrap handlers with error logging
export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Auth POST request received:", request.url);
    const response = await handler.POST(request);
    console.log("🔐 Auth POST response status:", response.status);
    return response;
  } catch (error: any) {
    console.error("❌ Auth POST error:", error);
    console.error("❌ Error stack:", error?.stack);
    console.error("❌ Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error?.message || "Unknown error",
        code: error?.code || "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("🔐 Auth GET request received:", request.url);
    const response = await handler.GET(request);
    console.log("🔐 Auth GET response status:", response.status);
    return response;
  } catch (error: any) {
    console.error("❌ Auth GET error:", error);
    console.error("❌ Error stack:", error?.stack);
    console.error("❌ Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error?.message || "Unknown error",
        code: error?.code || "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}