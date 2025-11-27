# 🔧 Fix 500 Error - Step by Step

## Quick Fix Steps

### Step 1: Add Secret Key to .env.local

Add this line to your `.env.local` file:

```env
BETTER_AUTH_SECRET=your-super-secret-key-minimum-32-characters-long-change-this-in-production
```

**Generate a secure secret:**
- Use an online generator: https://generate-secret.vercel.app/32
- Or run: `openssl rand -base64 32` (if you have OpenSSL)
- Or use any random 32+ character string

### Step 2: Verify Environment Variables

Make sure your `.env.local` has:

```env
# Required
TURSO_CONNECTION_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_token_here
NEXT_PUBLIC_SITE_URL=http://localhost:3001
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars

# Optional
RESEND_API_KEY=re_your_key
EMAIL_FROM=onboarding@resend.dev
```

### Step 3: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev:3001
```

### Step 4: Test Database Connection

Visit: `http://localhost:3001/api/test-db`

Should return:
```json
{
  "success": true,
  "database": "connected",
  ...
}
```

### Step 5: Try Signing In Again

If it still fails, check your **terminal** for detailed error messages.

## Common Issues

### Issue 1: Database Connection Failed
**Symptoms:** `api/test-db` returns error
**Fix:** 
- Check `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` are correct
- Verify Turso database is active
- Check Turso dashboard

### Issue 2: Missing Secret Key
**Symptoms:** 500 error persists after adding secret
**Fix:**
- Make sure `BETTER_AUTH_SECRET` is in `.env.local`
- Restart server after adding it
- Secret must be at least 32 characters

### Issue 3: User Doesn't Exist
**Symptoms:** "Invalid email or password" but 500 error
**Fix:**
- Try **registering** first (if registration also fails, it's a database/config issue)
- Check if user exists: visit `/admin/db-status`

### Issue 4: Database Schema Not Created
**Symptoms:** Tables missing
**Fix:**
```bash
npx drizzle-kit push
```

## Still Not Working?

1. **Check terminal logs** - Look for `❌` error messages
2. **Test database**: Visit `/api/test-db`
3. **Test auth API**: Visit `/api/auth/test`
4. **Check browser console** (F12) for client-side errors
5. **Check Network tab** (F12) for API response details

## Need More Help?

Share:
1. Terminal error output (the `❌` messages)
2. Result from `/api/test-db`
3. Result from `/api/auth/test`
4. Browser console errors (F12)

