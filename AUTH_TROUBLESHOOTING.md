# 🔐 Authentication Troubleshooting Guide

If sign-in and registration are not working, follow these steps to diagnose and fix the issue.

## 🔍 Step 1: Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Try to sign in or register
4. Look for error messages - they will now show detailed information

**What to look for:**
- `❌ Sign-in error:` or `❌ Registration error:` - These show the actual error
- Network errors (CORS, fetch failures)
- API endpoint errors

## 🔍 Step 2: Check Network Tab

1. Open Developer Tools → **Network** tab
2. Try to sign in or register
3. Look for requests to `/api/auth/[...]` endpoints
4. Check the **Status** column:
   - **200** = Success
   - **400/401** = Authentication error
   - **500** = Server error
   - **Failed/CORS** = Network/CORS issue

**Click on the failed request** to see:
- Request URL
- Response body (error message)
- Response headers

## 🔍 Step 3: Test Auth API Endpoint

Visit this URL in your browser to test if the auth API is working:

**Local:** `http://localhost:3000/api/auth/test`  
**Production:** `https://your-domain.vercel.app/api/auth/test`

**Expected response:**
```json
{
  "success": true,
  "message": "Auth API is working",
  "baseURL": "...",
  "hasDatabase": true,
  "timestamp": "..."
}
```

If this fails, the auth API is not configured correctly.

## 🔍 Step 4: Check Environment Variables

### For Local Development

Check your `.env.local` file:

```env
# Required
TURSO_CONNECTION_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_token_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional (for emails)
RESEND_API_KEY=re_your_key
EMAIL_FROM=onboarding@resend.dev
```

**Important:** 
- `NEXT_PUBLIC_SITE_URL` must match your dev server port (3000 or 3001)
- Restart your dev server after changing `.env.local`

### For Vercel Production

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Verify these are set:
   - `TURSO_CONNECTION_URL` ✅
   - `TURSO_AUTH_TOKEN` ✅
   - `NEXT_PUBLIC_SITE_URL` ✅ (MUST match your Vercel domain exactly, e.g., `https://your-app.vercel.app`)
   - `RESEND_API_KEY` (optional)
   - `EMAIL_FROM` (optional)

**Critical:** `NEXT_PUBLIC_SITE_URL` must be:
- Your exact Vercel domain (e.g., `https://amisag-ai-virtual-networking.vercel.app`)
- Include `https://`
- No trailing slash
- Must match exactly what's in the browser address bar

## 🔍 Step 5: Test Database Connection

Visit: `/admin/db-status` or `/api/test-db`

This will show:
- Database connection status
- Number of users
- Recent users
- Any database errors

**If database connection fails:**
- Check `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN`
- Verify your Turso database is active
- Check Turso dashboard for any issues

## 🔍 Step 6: Common Error Messages & Fixes

### "Network error" or "Failed to fetch"
**Cause:** API endpoint not reachable or CORS issue  
**Fix:**
- Check if dev server is running (`npm run dev`)
- Verify `NEXT_PUBLIC_SITE_URL` matches your current URL
- Check browser console for CORS errors

### "Invalid email or password"
**Cause:** Wrong credentials OR user doesn't exist  
**Fix:**
- Try registering a new account first
- Check if user exists in database (`/admin/db-status`)
- Verify password is correct

### "User already registered"
**Cause:** Email already exists  
**Fix:**
- Use a different email
- Or sign in with existing account

### "No data returned from sign-in"
**Cause:** Auth API returned success but no user data  
**Fix:**
- Check server logs for errors
- Verify database connection
- Check if better-auth tables exist (`user`, `account`, `session`)

### "Sign-in failed" or "Registration failed"
**Cause:** Generic error - check console for details  
**Fix:**
- Open browser console (F12)
- Look for detailed error messages
- Check network tab for API response

## 🔍 Step 7: Check Server Logs

### Local Development
Look at your terminal where `npm run dev` is running. You should see:
- `🔐 Auth baseURL configured as: ...`
- `🔐 Auth client baseURL: ...`
- `📝 Starting registration for: ...`
- `📡 Calling signIn.email API...`
- Any error messages

### Vercel Production
1. Go to **Vercel Dashboard** → Your Project → **Deployments**
2. Click on the latest deployment
3. Click **"View Function Logs"** or **"View Build Logs"**
4. Look for error messages

## 🔍 Step 8: Verify Database Schema

Make sure all required tables exist:

```bash
npx drizzle-kit push
```

This creates/updates:
- `user` table
- `account` table  
- `session` table
- Other auth-related tables

## 🔍 Step 9: Clear Browser Data

Sometimes cached data causes issues:

1. **Clear localStorage:**
   - Open Console (F12)
   - Run: `localStorage.clear()`
   - Refresh page

2. **Clear cookies:**
   - Open DevTools → Application → Cookies
   - Delete all cookies for your domain
   - Refresh page

3. **Hard refresh:**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

## 🔍 Step 10: Test with Fresh Account

1. Use a **completely new email** (never used before)
2. Try registering
3. Check console for errors
4. If registration succeeds, try signing in

## 🚨 Still Not Working?

If none of the above fixes work:

1. **Check the detailed error in browser console** - The improved error handling will show exactly what's wrong
2. **Check network tab** - See what API requests are failing
3. **Check server logs** - Look for server-side errors
4. **Verify environment variables** - Make sure they're set correctly
5. **Test database connection** - Use `/api/test-db` endpoint

## 📝 Quick Checklist

- [ ] Browser console shows detailed errors
- [ ] Network tab shows API requests
- [ ] `/api/auth/test` endpoint works
- [ ] Environment variables are set correctly
- [ ] `NEXT_PUBLIC_SITE_URL` matches current URL exactly
- [ ] Database connection works (`/api/test-db`)
- [ ] Database schema is up to date (`npx drizzle-kit push`)
- [ ] Dev server is running (for local)
- [ ] Vercel deployment is successful (for production)
- [ ] Browser cache cleared

## 💡 Most Common Issues

1. **`NEXT_PUBLIC_SITE_URL` mismatch** - Most common issue! Must match exactly.
2. **Database not connected** - Check Turso credentials
3. **Missing environment variables** - Check Vercel settings
4. **Database schema not created** - Run `npx drizzle-kit push`
5. **CORS issues** - Usually caused by wrong `NEXT_PUBLIC_SITE_URL`

---

**Need more help?** Check the browser console and network tab - the improved error handling will show exactly what's wrong!

