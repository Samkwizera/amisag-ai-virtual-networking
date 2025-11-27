# 🔍 Vercel Authentication Diagnostic Guide

## Quick Diagnostic

Visit this URL on your Vercel deployment to see what's wrong:

```
https://your-app.vercel.app/api/auth/diagnose
```

This will show you:
- ✅ What's working
- ❌ What's broken
- ⚠️ What needs attention

---

## Common Issues & Fixes

### ❌ Issue 1: "BETTER_AUTH_SECRET is missing"

**Fix:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add:
   ```
   Name: BETTER_AUTH_SECRET
   Value: [Generate 32+ character secret]
   Environment: Production, Preview, Development
   ```
3. Redeploy

**Generate secret:** https://generate-secret.vercel.app/32

---

### ❌ Issue 2: "Database connection failed"

**Fix:**
1. Check `TURSO_CONNECTION_URL` is set correctly
2. Check `TURSO_AUTH_TOKEN` is set correctly
3. Verify your Turso database is active
4. Apply schema: `npx drizzle-kit push`

---

### ❌ Issue 3: "Some required tables are missing"

**Fix:**
```bash
# Pull env vars from Vercel
vercel env pull .env.local

# Apply schema
npx drizzle-kit push
```

---

### ⚠️ Issue 4: "No users found"

**This is normal!** Users from localhost don't exist in production.

**Fix:**
1. Go to: `https://your-app.vercel.app/register`
2. Create a new account
3. Then try signing in

---

### ❌ Issue 5: "Base URL mismatch"

**Fix:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Set `NEXT_PUBLIC_SITE_URL` to your exact Vercel domain:
   ```
   Name: NEXT_PUBLIC_SITE_URL
   Value: https://your-exact-vercel-domain.vercel.app
   ```
3. Must match exactly (including `https://`, no trailing slash)
4. Redeploy

---

## Step-by-Step Fix

### Step 1: Run Diagnostic

Visit: `https://your-app.vercel.app/api/auth/diagnose`

### Step 2: Fix All Errors

Follow the fixes above for each error shown.

### Step 3: Redeploy

After fixing environment variables:
1. Go to Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Uncheck "Use existing Build Cache"
5. Click "Redeploy"

### Step 4: Test

1. Register: `https://your-app.vercel.app/register`
2. Sign in: `https://your-app.vercel.app/login`

---

## Still Not Working?

### Check Vercel Function Logs

1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Click "View Function Logs"
4. Look for:
   - `🔐 Auth baseURL configured as: ...`
   - `⚠️ WARNING: Using default secret` (means BETTER_AUTH_SECRET missing!)
   - Any error messages

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to register/login
4. Look for error messages

### Common Error Messages

- **"INVALID_ORIGIN"** → Base URL doesn't match
- **"500 Error"** → Check function logs for details
- **"Invalid email or password"** → User doesn't exist (register first!)
- **"Network error"** → Check API endpoint is reachable

---

## Checklist

- [ ] `BETTER_AUTH_SECRET` set in Vercel (32+ chars)
- [ ] `TURSO_CONNECTION_URL` set correctly
- [ ] `TURSO_AUTH_TOKEN` set correctly
- [ ] `NEXT_PUBLIC_SITE_URL` matches your domain exactly (or VERCEL_URL is available)
- [ ] Database schema applied (`npx drizzle-kit push`)
- [ ] Redeployed after adding env vars
- [ ] Ran diagnostic: `/api/auth/diagnose`
- [ ] All diagnostic checks pass
- [ ] Registered a new account on production
- [ ] Tested sign-in

---

**Most Common Issue:** Missing `BETTER_AUTH_SECRET`! Add it and redeploy.

