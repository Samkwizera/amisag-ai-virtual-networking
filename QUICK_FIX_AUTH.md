# 🚨 Quick Fix: Sign-In & Registration Not Working

## Step 1: Check What Error You're Seeing

**Open your browser console (F12) and tell me:**
1. What error message appears when you try to sign in?
2. What error message appears when you try to register?
3. Check the **Network** tab - what status code do you see for `/api/auth/[...]` requests?

## Step 2: Verify Server is Running

**Check your terminal where you ran `npm run dev:3001`:**
- Do you see `✓ Ready` or `✓ Compiled successfully`?
- Do you see `- Local: http://localhost:3001`?
- Are there any error messages?

**If the server isn't running:**
```bash
npm run dev:3001
```

## Step 3: Test These URLs in Your Browser

1. **Auth API Test:** `http://localhost:3001/api/auth/test`
   - Should return JSON with `"success": true`

2. **Database Test:** `http://localhost:3001/api/test-db`
   - Should return database status

3. **DB Status Page:** `http://localhost:3001/admin/db-status`
   - Should show database connection status

## Step 4: Common Issues & Quick Fixes

### Issue 1: "INVALID_ORIGIN" Error
**Fix:** Make sure `.env.local` has:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```
Then restart the server.

### Issue 2: "Failed to fetch" or Network Error
**Fix:** 
- Server isn't running - start it with `npm run dev:3001`
- Wrong port - check terminal for actual port
- Clear browser cache (Ctrl+Shift+R)

### Issue 3: Database Connection Error
**Fix:** Check `.env.local` has:
```env
TURSO_CONNECTION_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_token
```

### Issue 4: "Invalid email or password" (but credentials are correct)
**Fix:** 
- User might not exist - try registering first
- Check database has the user: visit `/admin/db-status`

## Step 5: Get Detailed Error Info

**In browser console (F12), run:**
```javascript
// Check auth client config
console.log('Auth baseURL:', window.location.origin)

// Check localStorage
console.log('Bearer token:', localStorage.getItem('bearer_token'))

// Clear everything and try again
localStorage.clear()
```

## Step 6: Share Error Details

Please share:
1. **Browser console error** (F12 → Console tab)
2. **Network tab status** (F12 → Network tab → Click on failed request)
3. **Terminal output** (from `npm run dev:3001`)
4. **What happens** when you try to sign in/register (does it show an error? does nothing happen?)

---

**Most Common Issue:** Server not running or wrong port!
Make sure you see `✓ Ready` in your terminal!

