# Fixing routes-manifest.json Error on Vercel

## The Error
```
Error: ENOENT: no such file or directory, lstat '/vercel/path0/vercel/path0/.next/routes-manifest.json'
```

## What This Means
This error occurs during the **build trace phase** (after the actual build completes). It's often **non-critical** and doesn't prevent deployment, but if it's causing your build to fail, here are solutions:

## Solution 1: Check Build Status
First, check if your deployment actually succeeded despite the error:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Check if the deployment shows as "Ready" or "Error"
3. If it's "Ready", the error is non-critical and your app is deployed!

## Solution 2: Configure Vercel Build Settings
If the build is failing, try these Vercel settings:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **General**
2. Under **Build & Development Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (leave as default)
   - **Install Command**: `npm install --legacy-peer-deps` (already set)
   - **Node.js Version**: `20.x` (recommended for Next.js 15)

## Solution 3: Clear Build Cache
The error might be caused by cached build artifacts:

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. **Uncheck** "Use existing Build Cache"
5. Click **"Redeploy"**

## Solution 4: Check Next.js Config
The latest commit includes `experimental.outputFileTracingExcludes` which should help. Make sure you've pulled the latest changes.

## Solution 5: Verify Environment Variables
Ensure all required environment variables are set:
- `TURSO_CONNECTION_URL`
- `TURSO_AUTH_TOKEN`
- `NEXT_PUBLIC_SITE_URL` (must match your Vercel domain exactly)

## If Build Still Fails
If the build is still failing after trying the above:

1. **Check Build Logs**: Go to the failed deployment → Click "View Build Logs" → Look for the actual error (not just the routes-manifest warning)

2. **Try Standalone Output** (if needed):
   Add to `next.config.ts`:
   ```typescript
   output: 'standalone',
   ```

3. **Contact Vercel Support**: If none of the above works, this might be a Vercel platform issue.

## Important Note
The `routes-manifest.json` error often appears **after** a successful build. Check your deployment status - if it shows "Ready", your app is deployed and working despite the error message!



