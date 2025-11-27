# 🗄️ Apply Database Schema to Production

## Current Status
Your `.env.local` is pointing to `local.db` (local database). To apply schema to **production Turso database**, follow one of these methods:

---

## ✅ Method 1: Pull from Vercel (Recommended)

This will pull your production environment variables from Vercel and apply the schema.

### Step 1: Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate.

### Step 2: Link Your Project
```bash
vercel link
```
- Select your project when prompted
- Choose the correct scope (your account/team)

### Step 3: Pull Environment Variables
```bash
vercel env pull .env.local
```
This will download production environment variables from Vercel and update your `.env.local`.

### Step 4: Apply Schema
```bash
npx drizzle-kit push
```
This will apply all migrations to your production Turso database.

---

## ✅ Method 2: Manual Setup

If you prefer to manually set production credentials:

### Step 1: Update `.env.local`

Open `.env.local` and update these lines:

```env
# Change from:
TURSO_CONNECTION_URL=file:./local.db

# To:
TURSO_CONNECTION_URL=libsql://amisag-samkwizera.aws-us-east-1.turso.io

# Keep your TURSO_AUTH_TOKEN as is
TURSO_AUTH_TOKEN=your_token_here
```

### Step 2: Apply Schema
```bash
npx drizzle-kit push
```

---

## ✅ Method 3: Use Environment Variables Directly

You can also set environment variables temporarily without modifying `.env.local`:

### Windows PowerShell:
```powershell
$env:TURSO_CONNECTION_URL = "libsql://amisag-samkwizera.aws-us-east-1.turso.io"
$env:TURSO_AUTH_TOKEN = "your_token_here"
npx drizzle-kit push
```

### Linux/Mac:
```bash
export TURSO_CONNECTION_URL="libsql://amisag-samkwizera.aws-us-east-1.turso.io"
export TURSO_AUTH_TOKEN="your_token_here"
npx drizzle-kit push
```

---

## 🔍 Verify Schema Applied

After running `npx drizzle-kit push`, you should see:

```
[✓] Pulling schema from database...
[✓] Applying migrations...
[✓] Schema pushed successfully
```

---

## 📋 What Gets Applied

The following migrations will be applied:
- `0000_cynical_mephisto.sql` - Initial schema (user, account, session, verification tables)
- `0001_low_thunderball.sql` - Additional schema updates
- `0002_thankful_goblin_queen.sql` - Projects table and related schema

---

## ⚠️ Important Notes

1. **Backup First**: If you have important data in production, consider backing it up first
2. **No Data Loss**: `drizzle-kit push` only adds new tables/columns, it won't delete existing data
3. **Test Locally**: Make sure migrations work on local database first
4. **Production Database**: Make sure you're applying to the correct database (production, not local)

---

## 🐛 Troubleshooting

### Error: "Unable to open connection"
- Check that `TURSO_CONNECTION_URL` is correct (should start with `libsql://`)
- Verify `TURSO_AUTH_TOKEN` is valid
- Ensure you have internet connection

### Error: "No changes detected"
- This means the schema is already up-to-date
- Check your database to verify tables exist

### Error: "Table already exists"
- Some tables might already exist
- This is usually fine - drizzle will skip existing tables

---

## ✅ After Applying Schema

1. **Test Registration**: Try registering a new account on Vercel
2. **Test Login**: Sign in with the new account
3. **Check Tables**: Verify tables exist in Turso dashboard

---

**Need help?** Check the Vercel deployment logs or Turso dashboard for more details.

