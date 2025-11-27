import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

// Wrap handlers with error logging
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    console.log("🔐 Auth POST request received:", url.pathname);
    console.log("🔐 Request body preview:", url.searchParams.toString() || "body in request");
    
    const response = await handler.POST(request);
    const status = response.status;
    console.log("🔐 Auth POST response status:", status);
    
    // If 500 error, try to get error details from response
    if (status === 500) {
      try {
        const responseClone = response.clone();
        const errorBody = await responseClone.text();
        console.error("❌ 500 Error response body:", errorBody);
        
        // Try to parse as JSON
        try {
          const errorJson = JSON.parse(errorBody);
          console.error("❌ Parsed error:", JSON.stringify(errorJson, null, 2));
        } catch {
          console.error("❌ Error body is not JSON:", errorBody);
        }
      } catch (err) {
        console.error("❌ Could not read error response:", err);
      }
    }
    
    return response;
  } catch (error: any) {
    console.error("❌ Auth POST exception caught:", error);
    console.error("❌ Error name:", error?.name);
    console.error("❌ Error message:", error?.message);
    console.error("❌ Error stack:", error?.stack);
    console.error("❌ Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error?.message || "Unknown error",
        code: error?.code || "INTERNAL_ERROR",
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined,
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