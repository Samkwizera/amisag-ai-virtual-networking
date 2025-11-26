# Resend Email Configuration

## Your Resend API Key

**API Key:** `re_4YRjYU8u_5rtkEZ6MnautSFLdXBRbGYSQ`

## Complete `.env.local` Configuration

Make sure your `.env.local` file includes:

```env
# Database Configuration (Turso)
TURSO_CONNECTION_URL=libsql://amisag-samkwizera.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjQxOTcxNDcsImlkIjoiZDlmN2Y5NDItNGNmMC00YzA2LWFkOTEtMjJlMzAyNmNhZWI1IiwicmlkIjoiNjI0N2Y1YjAtNzNmOC00N2U5LThmNzQtOGRhZGYzMWExMWI5In0.for8rNs4IGHjSsJgJS6w-JEXZCFbh5c90tU46he9vzwGX4wTbPMZFZBcolpGSDQdv5nSQy6jOCWrsGn3x_qPBw

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# Email Configuration (Resend)
RESEND_API_KEY=re_4YRjYU8u_5rtkEZ6MnautSFLdXBRbGYSQ
EMAIL_FROM=onboarding@resend.dev
```

## Testing Email Functionality

### Option 1: Test via Registration
1. Register a new user account
2. Check server console for email logs:
   - `📧 Attempting to send welcome email to: [email]`
   - `✅ Email sent successfully via Resend` (if successful)
   - `❌ Resend API error` (if there's an issue)

### Option 2: Test via Test Page
1. Visit `http://localhost:3001/test-email`
2. Enter your email address
3. Click "Send Test Email"
4. Check the result and server console

## Email Sending Details

- **From Address:** `onboarding@resend.dev` (Resend's default test domain - no verification needed)
- **To Address:** User's email from registration
- **Subject:** "Welcome to Amisag! 🎉"
- **Type:** HTML welcome email

## Troubleshooting

### Emails Not Sending?

1. **Check server console** - Look for detailed error messages
2. **Verify API key** - Make sure `RESEND_API_KEY` is set correctly in `.env.local`
3. **Restart server** - After updating `.env.local`, restart your dev server
4. **Check Resend dashboard** - Go to [resend.com](https://resend.com) → Logs to see email status

### Common Issues

- **API key invalid** → Check Resend dashboard for correct key
- **Domain not verified** → Using `onboarding@resend.dev` doesn't require verification (good for testing)
- **Rate limit** → Resend free tier allows 100 emails/day
- **Email in spam** → Check spam folder

## Production Setup

For production, you can:
1. **Keep using `onboarding@resend.dev`** (works but shows Resend branding)
2. **Verify your own domain** in Resend dashboard and use `noreply@yourdomain.com`

## Next Steps

1. ✅ Add `RESEND_API_KEY` to `.env.local`
2. ✅ Restart dev server
3. ✅ Test by registering a new user
4. ✅ Check email inbox (and spam folder)

