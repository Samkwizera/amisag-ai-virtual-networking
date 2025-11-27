import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

let handler: ReturnType<typeof toNextJsHandler>;
try {
  handler = toNextJsHandler(auth);
  console.log("✅ Better-auth handler initialized successfully");
} catch (initError: any) {
  console.error("❌ Failed to initialize better-auth handler:", initError);
  console.error("❌ Init error details:", initError?.message, initError?.stack);
  throw initError;
}

// Wrap handlers with error logging and better error handling
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    console.log("🔐 Auth POST request received:", pathname);
    
    // Clone request to read body for logging (if needed)
    let requestBody = null;
    try {
      const clonedRequest = request.clone();
      requestBody = await clonedRequest.json().catch(() => null);
      if (requestBody && pathname.includes('sign-in')) {
        console.log("🔐 Sign-in attempt for:", requestBody.email || "unknown email");
      }
    } catch {
      // Body might not be JSON or already consumed
    }
    
    let response: Response;
    try {
      response = await handler.POST(request);
    } catch (handlerError: any) {
      console.error("❌ Handler.POST threw an error:", handlerError);
      console.error("❌ Handler error message:", handlerError?.message);
      console.error("❌ Handler error stack:", handlerError?.stack);
      throw handlerError; // Re-throw to be caught by outer catch
    }
    
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
      
      // Return the original error response from better-auth
      return response;
    }
    
    return response;
  } catch (error: any) {
    console.error("❌ Auth POST exception caught:", error);
    console.error("❌ Error name:", error?.name);
    console.error("❌ Error message:", error?.message);
    console.error("❌ Error stack:", error?.stack);
    
    // Log more details if available
    if (error?.cause) {
      console.error("❌ Error cause:", error.cause);
    }
    
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error?.message || "Unknown error occurred",
        code: error?.code || "INTERNAL_ERROR",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined,
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