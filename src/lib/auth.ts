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

export const auth = betterAuth({
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