# ✅ Email Setup Checklist

## Your Resend API Key
```
re_4YRjYU8u_5rtkEZ6MnautSFLdXBRbGYSQ
```

## Step-by-Step Setup

### 1. ✅ Add to `.env.local`
Make sure your `.env.local` file contains:

```env
RESEND_API_KEY=re_4YRjYU8u_5rtkEZ6MnautSFLdXBRbGYSQ
EMAIL_FROM=onboarding@resend.dev
```

### 2. ✅ Restart Dev Server
**IMPORTANT:** After updating `.env.local`, you MUST restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev:3001
```

### 3. ✅ Test Email Sending

**Option A: Test via Registration**
1. Go to `http://localhost:3001/register`
2. Register a new user account
3. Check your **server console** (terminal) for logs:
   - Look for: `📧 Attempting to send welcome email to: [email]`
   - Look for: `✅ Email sent successfully via Resend`
   - If error: `❌ Resend API error:` with details

**Option B: Test via Test Page**
1. Go to `http://localhost:3001/test-email`
2. Enter your email address
3. Click "Send Test Email"
4. Check the result and server console

### 4. ✅ Check Email Inbox
- Check your email inbox (and spam folder)
- The email should arrive within a few seconds

## Expected Console Output (Success)

```
📧 Attempting to send welcome email to: user@example.com
📧 Sending email via Resend: {
  to: 'user@example.com',
  from: 'onboarding@resend.dev',
  subject: 'Welcome to Amisag! 🎉',
  hasApiKey: true
}
✅ Email sent successfully via Resend: {
  messageId: 're_xxxxxxxxxxxxx',
  to: 'user@example.com'
}
✅ Welcome email sent successfully: { success: true, messageId: 're_xxxxxxxxxxxxx' }
```

## Troubleshooting

### ❌ "RESEND_API_KEY not configured"
- **Fix:** Make sure `.env.local` has `RESEND_API_KEY=re_4YRjYU8u_5rtkEZ6MnautSFLdXBRbGYSQ`
- **Fix:** Restart your dev server after updating `.env.local`

### ❌ "Failed to send email: Invalid API key"
- **Fix:** Double-check the API key is correct (no extra spaces)
- **Fix:** Verify the key is active in your Resend dashboard

### ❌ "Rate limit exceeded"
- **Fix:** Resend free tier allows 100 emails/day. Wait or upgrade.

### ❌ No logs appearing
- **Fix:** Make sure you're looking at the **server console** (terminal), not browser console
- **Fix:** Check that the registration actually completed successfully

## Quick Test Command

After restarting your server, you can quickly verify the API key is loaded:

```bash
# In your server terminal, you should see logs when emails are sent
# Or visit: http://localhost:3001/test-email
```

## Next Steps

1. ✅ Add `RESEND_API_KEY` to `.env.local`
2. ✅ Restart dev server (`npm run dev:3001`)
3. ✅ Test by registering a new user
4. ✅ Check server console for email logs
5. ✅ Check email inbox

---

**Need Help?** Check the server console logs - they contain detailed information about what's happening!

