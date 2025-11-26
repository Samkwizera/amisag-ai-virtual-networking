# 🚀 Quick Deployment Guide (Vercel - 5 Minutes)

The fastest way to deploy your app. Follow these steps:

## Step 1: Push to GitHub (2 min)

```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Production Database (1 min)

1. Go to [Turso Dashboard](https://turso.tech/)
2. Create a **new database** (or use existing)
3. Copy:
   - **Connection URL** (looks like `libsql://xxx.turso.io`)
   - **Auth Token** (click "Show" to reveal)

## Step 3: Deploy to Vercel (2 min)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New Project"**
3. **Import** your GitHub repository
4. Click **"Deploy"** (don't configure anything yet)
5. Wait for build to complete (~2 minutes)

## Step 4: Add Environment Variables

After deployment, go to **Settings → Environment Variables** and add:

```
TURSO_CONNECTION_URL = libsql://your-db.turso.io
TURSO_AUTH_TOKEN = your_token_here
NEXT_PUBLIC_SITE_URL = https://your-app.vercel.app
```

**Important**: Replace `your-app.vercel.app` with your actual Vercel URL (shown after deployment).

## Step 5: Run Database Migrations

After first deployment, run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link
vercel login
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx drizzle-kit push
```

## Step 6: Redeploy

Go back to Vercel dashboard → **Deployments** → Click **"Redeploy"** (or push a new commit)

## ✅ Done!

Your app is now live at `https://your-app.vercel.app`

---

## 🔄 Updating Your Site

Every time you push to GitHub, Vercel automatically redeploys:

```bash
git add .
git commit -m "Your changes"
git push
```

---

## 🆘 Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Ensure Node.js version is 18+

**Database errors?**
- Verify environment variables are set correctly
- Run `npx drizzle-kit push` again

**Can't sign in?**
- Check `NEXT_PUBLIC_SITE_URL` matches your Vercel domain exactly
- Ensure it starts with `https://`

---

**Need more details?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive guide.

