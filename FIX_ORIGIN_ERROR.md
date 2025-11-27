# 🔧 Fixing INVALID_ORIGIN Error

## The Problem

You're getting `INVALID_ORIGIN` error because:
- Your `.env.local` has `NEXT_PUBLIC_SITE_URL=http://localhost:3001`
- But you might be accessing the app on `http://localhost:3000` (default Next.js port)

Better-auth validates that the request origin matches the configured `baseURL`, so they must match exactly.

## Solution 1: Use the Correct Port (Recommended)

**Option A: Access app on port 3001**
```bash
npm run dev:3001
```
Then open: `http://localhost:3001`

**Option B: Change .env.local to use port 3000**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
Then restart your dev server and access: `http://localhost:3000`

## Solution 2: Check What Port You're Using

1. Look at your terminal where `npm run dev` is running
2. It will show: `- Local: http://localhost:XXXX`
3. Make sure `NEXT_PUBLIC_SITE_URL` in `.env.local` matches that port

## Quick Fix

1. **Check your current port:**
   - Look at the URL in your browser
   - Is it `localhost:3000` or `localhost:3001`?

2. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
   OR
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3001
   ```
   (Match the port you're actually using!)

3. **Restart your dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

4. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click refresh button → "Empty Cache and Hard Reload"

5. **Try signing in again**

## Why This Happens

Better-auth checks the `Origin` header from your browser against the configured `baseURL`. If they don't match exactly, you get `INVALID_ORIGIN` error.

- Browser sends: `Origin: http://localhost:3000`
- Server expects: `baseURL: http://localhost:3001`
- ❌ Mismatch → Error!

## Verification

After fixing, check the browser console. You should see:
```
🔐 Auth client baseURL: http://localhost:3000
🔐 Auth baseURL configured as: http://localhost:3000
```

Both should match the port you're using!

