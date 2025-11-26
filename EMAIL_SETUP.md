# Email Notifications Setup Guide

## Current Status

✅ **Email notification system is implemented** - Users will receive welcome emails after registration.

⚠️ **Email service needs to be configured** - Currently, emails are logged in development mode but not actually sent.

## Setup Instructions

### Option 1: Using Resend (Recommended)

1. **Sign up for Resend**
   - Go to https://resend.com
   - Create a free account (100 emails/day free tier)

2. **Get your API Key**
   - Go to API Keys section in Resend dashboard
   - Create a new API key
   - Copy the key

3. **Add Environment Variables**
   Create a `.env.local` file in your project root (if it doesn't exist) and add:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM=noreply@yourdomain.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Verify Your Domain** (for production)
   - In Resend dashboard, add and verify your domain
   - Update `EMAIL_FROM` to use your verified domain

### Option 2: Using SMTP (Gmail, Outlook, etc.)

If you prefer to use SMTP instead of Resend, you can modify `src/lib/email.ts` to use Nodemailer:

1. Install Nodemailer:
   ```bash
   npm install nodemailer
   ```

2. Update `src/lib/email.ts` to use SMTP configuration

3. Add environment variables:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   EMAIL_FROM=noreply@yourdomain.com
   ```

## Testing

### Development Mode
- In development, emails are logged to the console instead of being sent
- Check your terminal/console after registration to see the email content

### Production Mode
- Emails will be sent via Resend (or your configured provider)
- Make sure `RESEND_API_KEY` is set in your production environment variables

## What Emails Are Sent?

1. **Welcome Email** - Sent immediately after successful registration
   - Contains welcome message
   - Links to get started
   - Information about the platform

## Troubleshooting

### Emails not sending?
1. Check that `RESEND_API_KEY` is set correctly
2. Verify your domain in Resend (for production)
3. Check server logs for error messages
4. Ensure `EMAIL_FROM` uses a verified domain

### Testing locally?
- Emails are logged to console in development mode
- Use Resend's test mode or a service like Mailtrap for testing

## Next Steps

- [ ] Set up Resend account and get API key
- [ ] Add environment variables to `.env.local`
- [ ] Test registration flow
- [ ] Verify email delivery
- [ ] Customize email templates if needed

