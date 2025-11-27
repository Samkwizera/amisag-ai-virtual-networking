# 🚨 Quick Fix: Registration & Login Still Not Working on Vercel

## Step 1: Run Diagnostic

Visit this URL on your Vercel deployment:

```
https://your-app.vercel.app/api/auth/diagnose
```

This will show you **exactly** what's wrong.

---

## Step 2: Fix Based on Diagnostic Results

### If you see: "BETTER_AUTH_SECRET is missing"

**Fix:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add:
   ```
   Name: BETTER_AUTH_SECRET
   Value: [Generate 32+ character secret]
   ```
   Generate: https://generate-secret.vercel.app/32
3. **Redeploy** (Deployments → "..." → Redeploy → Uncheck cache)

---

### If you see: "Database connection failed"

**Fix:**
1. Check `TURSO_CONNECTION_URL` is set: `libsql://amisag-samkwizera.aws-us-east-1.turso.io`
2. Check `TURSO_AUTH_TOKEN` is set correctly
3. Verify Turso database is active

---

### If you see: "Some required tables are missing"

**Fix:**
```bash
# Pull env vars from Vercel
vercel env pull .env.local

# Apply schema
npx drizzle-kit push
```

---

### If you see: "Base URL mismatch"

**Fix:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Set `NEXT_PUBLIC_SITE_URL` to your exact domain:
   ```
   Name: NEXT_PUBLIC_SITE_URL
   Value: https://your-exact-vercel-domain.vercel.app
   ```
3. Must match exactly (including `https://`, no trailing slash)
4. **Redeploy**

---

### If you see: "No users found"

**This is normal!** Users from localhost don't exist in production.

**Fix:**
1. Go to: `https://your-app.vercel.app/register`
2. Create a new account
3. Then try signing in

---

## Step 3: Check Vercel Function Logs

1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Click **"View Function Logs"**
4. Look for:
   - `🔐 Auth baseURL configured as: ...`
   - `⚠️ WARNING: Using default secret` (means BETTER_AUTH_SECRET missing!)
   - Any error messages

---

## Step 4: Common Error Messages

### "INVALID_ORIGIN"
- **Cause:** Base URL doesn't match your domain
- **Fix:** Set `NEXT_PUBLIC_SITE_URL` correctly and redeploy

### "500 Error"
- **Cause:** Missing `BETTER_AUTH_SECRET` or database issue
- **Fix:** Check function logs, add missing env vars, redeploy

### "Invalid email or password"
- **Cause:** User doesn't exist (register first!) or wrong password
- **Fix:** Register a new account on production

### "Network error" or "Failed to fetch"
- **Cause:** API endpoint not reachable
- **Fix:** Check function logs, verify deployment is successful

---

## Quick Checklist

- [ ] Ran diagnostic: `/api/auth/diagnose`
- [ ] All diagnostic checks pass ✅
- [ ] `BETTER_AUTH_SECRET` set (32+ chars)
- [ ] `TURSO_CONNECTION_URL` set correctly
- [ ] `TURSO_AUTH_TOKEN` set correctly
- [ ] `NEXT_PUBLIC_SITE_URL` matches domain exactly (or VERCEL_URL available)
- [ ] Database schema applied (`npx drizzle-kit push`)
- [ ] Redeployed after adding env vars
- [ ] Checked function logs for errors
- [ ] Registered a new account on production
- [ ] Tested sign-in

---

## Still Not Working?

1. **Check diagnostic:** `/api/auth/diagnose`
2. **Check function logs:** Vercel Dashboard → Deployments → View Function Logs
3. **Check browser console:** F12 → Console tab
4. **Verify environment variables:** Settings → Environment Variables

**Most Common Issue:** Missing `BETTER_AUTH_SECRET`! Add it and redeploy.

