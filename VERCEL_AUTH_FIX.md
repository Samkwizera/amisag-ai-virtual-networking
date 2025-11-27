# 🔧 Fix Authentication on Vercel

## The Problem
Authentication works on localhost but shows "invalid login" on Vercel.

## Root Causes
1. **Missing `BETTER_AUTH_SECRET`** in Vercel environment variables
2. **Database schema not applied** to production Turso database
3. **`NEXT_PUBLIC_SITE_URL`** doesn't match your Vercel domain exactly
4. **Users don't exist** in production database (they're only in local.db)

---

## ✅ Step 1: Add Missing Environment Variables

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

### Required Variables (Check ALL of these):

1. **`BETTER_AUTH_SECRET`** ⚠️ **CRITICAL - Likely Missing!**
   ```
   Name: BETTER_AUTH_SECRET
   Value: [Generate a secure 32+ character string]
   Environment: Production, Preview, Development (select all)
   ```
   
   **Generate a secret:**
   - Use: https://generate-secret.vercel.app/32
   - Or use: `skabjvDQO2dFpLcmo1HBCPGtKAE98JU0` (from your local .env.local)
   - **MUST be at least 32 characters**

2. **`TURSO_CONNECTION_URL`**
   ```
   Name: TURSO_CONNECTION_URL
   Value: libsql://amisag-samkwizera.aws-us-east-1.turso.io
   Environment: Production, Preview, Development
   ```

3. **`TURSO_AUTH_TOKEN`**
   ```
   Name: TURSO_AUTH_TOKEN
   Value: [Your Turso token]
   Environment: Production, Preview, Development
   ```

4. **`NEXT_PUBLIC_SITE_URL`** ⚠️ **Must match EXACTLY!**
   ```
   Name: NEXT_PUBLIC_SITE_URL
   Value: https://your-actual-vercel-domain.vercel.app
   Environment: Production, Preview, Development
   ```
   
   **How to find your exact domain:**
   - Go to Vercel Dashboard → Your Project → **Deployments**
   - Click on the latest deployment
   - Copy the URL shown (e.g., `https://amisag-ai-virtual-networking-abc123.vercel.app`)
   - **Must include `https://`**
   - **No trailing slash**
   - **Must match exactly what's in the browser address bar**

### Optional Variables:

5. **`RESEND_API_KEY`** (for emails)
   ```
   Name: RESEND_API_KEY
   Value: re_4YRjYU8u_5rtkEZ6MnautSFLdXBRbGYSQ
   Environment: Production, Preview, Development
   ```

6. **`EMAIL_FROM`** (for emails)
   ```
   Name: EMAIL_FROM
   Value: onboarding@resend.dev
   Environment: Production, Preview, Development
   ```

---

## ✅ Step 2: Apply Database Schema to Production

Your production Turso database needs the same tables as localhost.

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project (in your project directory)
cd c:\Users\samue\Desktop\amisag-ai-virtual-networking-1
vercel link

# Pull environment variables (this will update .env.local with production values)
vercel env pull .env.local

# Now run migrations against production database
npx drizzle-kit push
```

### Option B: Using Turso CLI

```bash
# Install Turso CLI
npm install -g @libsql/cli

# Login to Turso
turso auth login

# Run migrations
# Make sure TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN are set in your environment
export TURSO_CONNECTION_URL="libsql://amisag-samkwizera.aws-us-east-1.turso.io"
export TURSO_AUTH_TOKEN="your_token_here"

npx drizzle-kit push
```

### Option C: Manual SQL Execution

If you have access to Turso dashboard, you can run the SQL migrations manually from the `drizzle/` folder.

---

## ✅ Step 3: Redeploy on Vercel

After adding environment variables:

1. Go to **Vercel Dashboard** → Your Project → **Deployments**
2. Find the latest deployment
3. Click **"..."** (three dots) menu
4. Click **"Redeploy"**
5. **Uncheck** "Use existing Build Cache"
6. Click **"Redeploy"**

Wait for deployment to complete (~2-3 minutes).

---

## ✅ Step 4: Test Authentication

1. **Test Auth API:**
   - Visit: `https://your-app.vercel.app/api/auth/test`
   - Should return: `{"success": true, ...}`

2. **Test Database:**
   - Visit: `https://your-app.vercel.app/api/test-auth-db`
   - Should show all tests passing

3. **Register a New Account:**
   - Go to: `https://your-app.vercel.app/register`
   - Create a new account (users from localhost won't exist in production)
   - This should work now!

4. **Sign In:**
   - Use the account you just created
   - Should work!

---

## 🔍 Troubleshooting

### Still Getting "Invalid Login"?

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → **Deployments**
   - Click on latest deployment
   - Click **"View Function Logs"**
   - Look for error messages

2. **Verify Environment Variables:**
   - Go to Settings → Environment Variables
   - Make sure `BETTER_AUTH_SECRET` is set
   - Make sure `NEXT_PUBLIC_SITE_URL` matches your domain exactly

3. **Check Database:**
   - Visit: `https://your-app.vercel.app/api/test-auth-db`
   - Should show database connection working

4. **Register First:**
   - Users from localhost don't exist in production
   - You MUST register a new account on Vercel
   - Then sign in with that account

### Common Issues:

- **"INVALID_ORIGIN"** → `NEXT_PUBLIC_SITE_URL` doesn't match your domain
- **"500 Error"** → Missing `BETTER_AUTH_SECRET` or database schema not applied
- **"Invalid email or password"** → User doesn't exist (register first!) or wrong password

---

## 📋 Quick Checklist

- [ ] `BETTER_AUTH_SECRET` added to Vercel (32+ characters)
- [ ] `TURSO_CONNECTION_URL` set correctly
- [ ] `TURSO_AUTH_TOKEN` set correctly
- [ ] `NEXT_PUBLIC_SITE_URL` matches your Vercel domain exactly
- [ ] Database schema applied to production (`npx drizzle-kit push`)
- [ ] Redeployed on Vercel (after adding env vars)
- [ ] Registered a new account on production (users from localhost don't exist)
- [ ] Tested sign-in with the new account

---

**Most Common Issue:** Missing `BETTER_AUTH_SECRET`! Add it to Vercel environment variables.

