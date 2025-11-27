import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { NextRequest } from 'next/server';
import { headers } from "next/headers"
import { db } from "@/db";

// Email configuration - using Resend (you can also use SMTP, SendGrid, etc.)
const emailConfig = process.env.RESEND_API_KEY
	? {
			provider: "resend" as const,
			apiKey: process.env.RESEND_API_KEY,
			from: process.env.EMAIL_FROM || "noreply@amisag.com",
		}
	: undefined;

// Get base URL - prioritize environment variable, fallback to Vercel URL or localhost
// IMPORTANT: In development, this should match the port you're actually using
const getBaseURL = () => {
	// If explicitly set, use it (highest priority)
	if (process.env.NEXT_PUBLIC_SITE_URL) {
		return process.env.NEXT_PUBLIC_SITE_URL
	}
	
	// In Vercel, use VERCEL_URL (automatically provided by Vercel)
	// VERCEL_URL is like "your-app.vercel.app" (without protocol)
	// Vercel always uses HTTPS
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`
	}
	
	// In development, default to port 3000 (Next.js default)
	// If you're using port 3001, set NEXT_PUBLIC_SITE_URL=http://localhost:3001 in .env.local
	if (process.env.NODE_ENV === "development") {
		// Check if PORT env var is set (from npm run dev:3001)
		const port = process.env.PORT || "3000"
		return `http://localhost:${port}`
	}
	
	// Last resort fallback - should not happen in production
	console.warn("⚠️ WARNING: No baseURL configured! Set NEXT_PUBLIC_SITE_URL or deploy on Vercel.")
	return "http://localhost:3000"
}

const baseURL = getBaseURL()
console.log("🔐 Auth baseURL configured as:", baseURL)
console.log("🔐 NODE_ENV:", process.env.NODE_ENV)
console.log("🔐 NEXT_PUBLIC_SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL || "Not set")
console.log("🔐 VERCEL_URL:", process.env.VERCEL_URL || "Not set (not on Vercel)")
console.log("🔐 VERCEL_ENV:", process.env.VERCEL_ENV || "Not set")
console.log("🔐 Database URL:", process.env.TURSO_CONNECTION_URL ? "Set (Turso)" : "Not set (using local.db)")
console.log("🔐 BETTER_AUTH_SECRET:", process.env.BETTER_AUTH_SECRET ? "Set" : "⚠️ NOT SET - Using default!")

// Better-auth requires a secret for session encryption
// Generate a secure random secret if not provided
const authSecret = process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "dev-secret-change-in-production-min-32-chars";

if (!process.env.BETTER_AUTH_SECRET && !process.env.AUTH_SECRET) {
	console.warn("⚠️ WARNING: Using default secret. Set BETTER_AUTH_SECRET in .env.local for production!");
}

export const auth = betterAuth({
	baseURL: baseURL,
	secret: authSecret,
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	emailAndPassword: {
		enabled: true,
		// Enable email verification (optional - you can disable this if you don't want verification)
		requireEmailVerification: false,
	},
	email: emailConfig
		? {
				server: emailConfig,
				// Customize email templates
				async sendVerificationEmail({ user, url, token }) {
					// This will be called when email verification is enabled
					console.log("Verification email would be sent to:", user.email);
				},
				async sendWelcomeEmail({ user }) {
					// This will be called after successful signup
					console.log("Welcome email would be sent to:", user.email);
				},
			}
		: undefined,
	plugins: [bearer()],
});

// Session validation helper
export async function getCurrentUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user || null;
}