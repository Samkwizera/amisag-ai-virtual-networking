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

// Get base URL - prioritize environment variable, fallback to localhost
const getBaseURL = () => {
	if (process.env.NEXT_PUBLIC_SITE_URL) {
		return process.env.NEXT_PUBLIC_SITE_URL
	}
	// In development, use localhost:3001 (or 3000 if that's what the dev server uses)
	if (process.env.NODE_ENV === "development") {
		return process.env.PORT === "3001" ? "http://localhost:3001" : "http://localhost:3000"
	}
	// Fallback for production if NEXT_PUBLIC_SITE_URL is not set
	return "http://localhost:3000"
}

const baseURL = getBaseURL()
console.log("🔐 Auth baseURL configured as:", baseURL)

export const auth = betterAuth({
	baseURL: baseURL,
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