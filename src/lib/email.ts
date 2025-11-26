/**
 * Email service for sending notifications
 * Currently supports Resend, but can be extended to support other providers
 */

interface SendEmailOptions {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
	// If Resend is configured, use it
	if (process.env.RESEND_API_KEY) {
		try {
			const response = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
				},
				body: JSON.stringify({
					from: process.env.EMAIL_FROM || "noreply@amisag.com",
					to: [to],
					subject,
					html,
					text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				console.error("Resend API error:", error);
				throw new Error(`Failed to send email: ${error.message || "Unknown error"}`);
			}

			const data = await response.json();
			console.log("Email sent successfully:", data.id);
			return { success: true, messageId: data.id };
		} catch (error) {
			console.error("Error sending email via Resend:", error);
			throw error;
		}
	}

	// Fallback: Log email in development
	if (process.env.NODE_ENV === "development") {
		console.log("📧 Email (development mode - not sent):");
		console.log("To:", to);
		console.log("Subject:", subject);
		console.log("HTML:", html);
		return { success: true, messageId: "dev-mode" };
	}

	throw new Error("No email service configured. Please set RESEND_API_KEY environment variable.");
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(user: { name: string; email: string }) {
	const subject = "Welcome to Amisag! 🎉";
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Welcome to Amisag</title>
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
				<h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Amisag!</h1>
			</div>
			<div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
				<p style="font-size: 16px; margin-bottom: 20px;">Hi ${user.name},</p>
				<p style="font-size: 16px; margin-bottom: 20px;">
					Thank you for joining Amisag! We're excited to have you as part of our community connecting professionals across Africa.
				</p>
				<p style="font-size: 16px; margin-bottom: 20px;">
					Your account has been successfully created. You can now:
				</p>
				<ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
					<li>Connect with professionals across Africa</li>
					<li>Join communities in your industry</li>
					<li>Build meaningful professional relationships</li>
					<li>Discover opportunities and collaborations</li>
				</ul>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/network" 
					   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: 600;">
						Get Started
					</a>
				</div>
				<p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
					If you have any questions, feel free to reach out to our support team.
				</p>
				<p style="font-size: 14px; color: #666; margin-top: 10px;">
					Best regards,<br>
					The Amisag Team
				</p>
			</div>
		</body>
		</html>
	`;

	return sendEmail({
		to: user.email,
		subject,
		html,
	});
}

