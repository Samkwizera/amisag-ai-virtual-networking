# 🚨 Quick Fix: Registration & Login Not Working on Vercel

## The Problem
Registration and login work on localhost but fail on Vercel.

## Root Causes (Check These!)

1. **Missing `BETTER_AUTH_SECRET`** ⚠️ **MOST COMMON**
2. **Missing or incorrect `NEXT_PUBLIC_SITE_URL`**
3. **Database schema not applied** to production Turso database
4. **Users don't exist** in production (they're only in local.db)

---

## ✅ Quick Fix (5 Minutes)

### Step 1: Check Vercel Environment Variables

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

**Required Variables:**

1. **`BETTER_AUTH_SECRET`** ⚠️ **CRITICAL**
   ```
   Name: BETTER_AUTH_SECRET
   Value: [Any secure 32+ character string]
   Environment: Production, Preview, Development (select all)
   ```
   
   **Quick Generate:**
   - Visit: https://generate-secret.vercel.app/32
   - Copy the generated secret
   - Or use: `skabjvDQO2dFpLcmo1HBCPGtKAE98JU0` (from your local .env.local)

2. **`NEXT_PUBLIC_SITE_URL`** (Optional but Recommended)
   ```
   Name: NEXT_PUBLIC_SITE_URL
   Value: https://your-actual-vercel-domain.vercel.app
   Environment: Production, Preview, Development
   ```
   
   **Note:** If not set, the app will automatically use `VERCEL_URL` (provided by Vercel).

3. **`TURSO_CONNECTION_URL`**
   ```
   Name: TURSO_CONNECTION_URL
   Value: libsql://amisag-samkwizera.aws-us-east-1.turso.io
   Environment: Production, Preview, Development
   ```

4. **`TURSO_AUTH_TOKEN`**
   ```
   Name: TURSO_AUTH_TOKEN
   Value: [Your Turso token]
   Environment: Production, Preview, Development
   ```

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. **Uncheck** "Use existing Build Cache"
5. Click **"Redeploy"**

Wait ~2-3 minutes for deployment.

### Step 3: Apply Database Schema

Your production database needs the same tables as localhost:

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login and link
vercel login
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations against production database
npx drizzle-kit push
```

### Step 4: Register a New Account

**Important:** Users from localhost don't exist in production!

1. Go to: `https://your-app.vercel.app/register`
2. Create a new account
3. Sign in with that account

---

## 🔍 Verify It's Working

### Check Auth Configuration:
Visit: `https://your-app.vercel.app/api/auth/test`

Should return:
```json
{
  "success": true,
  "message": "Auth API is working",
  "baseURL": "https://your-app.vercel.app",
  "hasDatabase": true
}
```

### Check Database:
Visit: `https://your-app.vercel.app/api/test-auth-db`

Should show all tests passing ✅

---

## 🐛 Still Not Working?

### Check Vercel Function Logs:

1. Go to **Vercel Dashboard** → Your Project → **Deployments**
2. Click on latest deployment
3. Click **"View Function Logs"**
4. Look for:
   - `🔐 Auth baseURL configured as: ...`
   - `⚠️ WARNING: Using default secret` (means `BETTER_AUTH_SECRET` is missing!)
   - Any error messages

### Common Errors:

- **"INVALID_ORIGIN"** → `NEXT_PUBLIC_SITE_URL` doesn't match your domain
- **"500 Error"** → Missing `BETTER_AUTH_SECRET` or database schema not applied
- **"Invalid email or password"** → User doesn't exist (register first!)

---

## 📋 Checklist

- [ ] `BETTER_AUTH_SECRET` added to Vercel (32+ characters)
- [ ] `TURSO_CONNECTION_URL` set correctly
- [ ] `TURSO_AUTH_TOKEN` set correctly
- [ ] `NEXT_PUBLIC_SITE_URL` set (optional - will use VERCEL_URL if not set)
- [ ] Redeployed on Vercel (after adding env vars)
- [ ] Database schema applied (`npx drizzle-kit push`)
- [ ] Registered a new account on production
- [ ] Tested sign-in with the new account

---

**Most Common Issue:** Missing `BETTER_AUTH_SECRET`! Add it to Vercel environment variables and redeploy.

