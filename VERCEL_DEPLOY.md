# 🚀 Vercel Deployment Guide

Step-by-step guide to deploy your app to Vercel.

## Prerequisites

✅ Your code is already pushed to GitHub (we just did this!)
✅ You have a Turso database URL and token
✅ You have a Resend API key (optional, for emails)

---

## Step 1: Sign Up / Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (or **"Log In"** if you have an account)
3. Sign up with **GitHub** (recommended - easiest integration)

---

## Step 2: Import Your Project

1. After logging in, click **"Add New Project"** (or **"New Project"**)
2. You'll see a list of your GitHub repositories
3. Find **`amisag-ai-virtual-networking`** and click **"Import"**

---

## Step 3: Configure Project Settings

Vercel will auto-detect Next.js, but verify these settings:

- **Framework Preset**: Next.js ✅ (auto-detected)
- **Root Directory**: `./` (default - leave as is)
- **Build Command**: `npm run build` (default - leave as is)
- **Output Directory**: `.next` (default - leave as is)
- **Install Command**: `npm install` (default - leave as is)

**Click "Deploy"** (don't add environment variables yet - we'll do that after)

---

## Step 4: Wait for First Deployment

- Vercel will build your app (takes ~2-3 minutes)
- The build will likely **fail** because environment variables aren't set yet
- **That's OK!** We'll fix this next

---

## Step 5: Add Environment Variables

After the first deployment attempt:

1. Go to your project dashboard
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in the left sidebar
4. Add these variables (click **"Add"** for each):

### Required Variables:

```
Name: TURSO_CONNECTION_URL
Value: libsql://amisag-samkwizera.aws-us-east-1.turso.io
Environment: Production, Preview, Development (select all)
```

```
Name: TURSO_AUTH_TOKEN
Value: eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjQxOTcxNDcsImlkIjoiZDlmN2Y5NDItNGNmMC00YzA2LWFkOTEtMjJlMzAyNmNhZWI1IiwicmlkIjoiNjI0N2Y1YjAtNzNmOC00N2U5LThmNzQtOGRhZGYzMWExMWI5In0.for8rNs4IGHjSsJgJS6w-JEXZCFbh5c90tU46he9vzwGX4wTbPMZFZBcolpGSDQdv5nSQy6jOCWrsGn3x_qPBw
Environment: Production, Preview, Development (select all)
```

```
Name: NEXT_PUBLIC_SITE_URL
Value: https://your-app-name.vercel.app
Environment: Production, Preview, Development (select all)
```
**⚠️ IMPORTANT**: Replace `your-app-name.vercel.app` with your **actual Vercel domain** (shown after deployment)

### Optional Variables (for emails):

```
Name: RESEND_API_KEY
Value: re_4YRjYU8u_5rtkEZ6MnautSFLdXBRbGYSQ
Environment: Production, Preview, Development (select all)
```

```
Name: EMAIL_FROM
Value: onboarding@resend.dev
Environment: Production, Preview, Development (select all)
```

---

## Step 6: Update NEXT_PUBLIC_SITE_URL

After adding all variables:

1. Go back to **"Environment Variables"**
2. Find `NEXT_PUBLIC_SITE_URL`
3. Click **"Edit"**
4. Replace the value with your **actual Vercel URL**:
   - Go to **"Deployments"** tab
   - Copy the URL (e.g., `https://amisag-ai-virtual-networking-abc123.vercel.app`)
   - Update `NEXT_PUBLIC_SITE_URL` with this exact URL

---

## Step 7: Redeploy

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Select **"Use existing Build Cache"** = **No** (to rebuild with new env vars)
6. Click **"Redeploy"**

---

## Step 8: Run Database Migrations

After successful deployment, run migrations:

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project (in your project directory)
cd c:\Users\samue\Desktop\amisag-ai-virtual-networking-1
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx drizzle-kit push
```

### Option B: Using Turso CLI

```bash
# Install Turso CLI
curl -sSf https://get.turso.tech/install.sh | bash

# Login to Turso
turso auth login

# Run migrations (using your production database URL)
TURSO_CONNECTION_URL=libsql://amisag-samkwizera.aws-us-east-1.turso.io \
TURSO_AUTH_TOKEN=your_token_here \
npx drizzle-kit push
```

---

## Step 9: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try registering a new user
3. Try signing in
4. Check if everything works!

---

## ✅ Success!

Your app is now live! 🎉

---

## 🔄 Updating Your Site

Every time you push to GitHub, Vercel automatically redeploys:

```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will automatically:
- Detect the push
- Build your app
- Deploy the new version

---

## 🆘 Troubleshooting

### Build Fails?

1. Check **"Deployments"** → Click on failed deployment → Check **"Build Logs"**
2. Common issues:
   - Missing environment variables
   - Node.js version mismatch (should be 18+)
   - Build errors in your code

### Database Connection Errors?

1. Verify `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` are correct
2. Make sure you selected **all environments** (Production, Preview, Development)
3. Try running `npx drizzle-kit push` again

### Can't Sign In?

1. Check `NEXT_PUBLIC_SITE_URL` matches your Vercel domain **exactly**
2. Make sure it starts with `https://` (not `http://`)
3. Redeploy after changing `NEXT_PUBLIC_SITE_URL`

### Emails Not Working?

1. Verify `RESEND_API_KEY` is set correctly
2. Check Resend dashboard for email logs
3. Make sure `EMAIL_FROM` is set

---

## 📝 Quick Reference

**Your Environment Variables:**
- `TURSO_CONNECTION_URL`: `libsql://amisag-samkwizera.aws-us-east-1.turso.io`
- `TURSO_AUTH_TOKEN`: `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...`
- `NEXT_PUBLIC_SITE_URL`: `https://your-app.vercel.app` (update after deployment)
- `RESEND_API_KEY`: `re_4YRjYU8u_5rtkEZ6MnautSFLdXBRbGYSQ`
- `EMAIL_FROM`: `onboarding@resend.dev`

**Vercel Dashboard:** https://vercel.com/dashboard

---

Need help? Check the build logs in Vercel dashboard for detailed error messages!


