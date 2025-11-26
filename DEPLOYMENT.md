# Deployment Guide

This guide covers deploying your Amisag AI Virtual Networking Platform to various platforms.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- ✅ A **Turso database** (production database, not local)
- ✅ **Environment variables** ready
- ✅ **Git repository** set up (GitHub, GitLab, etc.)
- ✅ **Resend API key** (optional, for emails)

---

## 🚀 Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest and fastest way to deploy Next.js applications.

### Step 1: Prepare Your Repository

1. **Push your code to GitHub/GitLab/Bitbucket:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Create `.gitignore` if you don't have one:**
   ```
   node_modules/
   .next/
   .env.local
   .env*.local
   local.db
   local.db-journal
   .vercel
   dist/
   build/
   ```

### Step 2: Set Up Turso Production Database

1. Go to [Turso Dashboard](https://turso.tech/)
2. Create a **new database** for production (or use existing)
3. Copy your **Connection URL** and **Auth Token**

### Step 3: Deploy to Vercel

1. **Sign up/Login** at [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. **Import your Git repository**
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### Step 4: Add Environment Variables

In Vercel dashboard → Your Project → Settings → Environment Variables, add:

```env
# Database (Production Turso)
TURSO_CONNECTION_URL=libsql://your-production-db.turso.io
TURSO_AUTH_TOKEN=your_production_turso_token

# Site URL (Your Vercel domain)
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

# Email (Optional)
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
```

**Important**: 
- Add these for **Production**, **Preview**, and **Development** environments
- Replace `your-app.vercel.app` with your actual Vercel domain

### Step 5: Run Database Migrations

After first deployment, you need to run migrations:

**Option A: Via Vercel CLI (Recommended)**
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
npx drizzle-kit push
```

**Option B: Via Turso CLI**
```bash
# Install Turso CLI
curl -sSf https://get.turso.tech/install.sh | bash

# Link to your database
turso db link your-db-name

# Run migrations
npx drizzle-kit push
```

### Step 6: Deploy

1. Click **"Deploy"** in Vercel
2. Wait for build to complete (~2-3 minutes)
3. Your site will be live at `https://your-app.vercel.app`

---

## 🌐 Option 2: Deploy to Netlify

### Step 1: Prepare Build Settings

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

### Step 2: Deploy

1. Sign up at [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your Git repository
4. Add environment variables (same as Vercel above)
5. Click **"Deploy site"**

**Note**: Netlify requires additional configuration for Next.js API routes. Consider Vercel for easier Next.js deployment.

---

## 🚂 Option 3: Deploy to Railway

Railway is great for full-stack apps with databases.

### Step 1: Deploy

1. Sign up at [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will auto-detect Next.js

### Step 2: Add Environment Variables

In Railway dashboard → Your Project → Variables:

```env
TURSO_CONNECTION_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_token
NEXT_PUBLIC_SITE_URL=https://your-app.up.railway.app
RESEND_API_KEY=your_key
EMAIL_FROM=noreply@yourdomain.com
```

### Step 3: Run Migrations

Use Railway's CLI or connect via SSH:
```bash
railway run npx drizzle-kit push
```

---

## 🐳 Option 4: Deploy with Docker

### Step 1: Create Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Step 2: Update next.config.ts

Add output configuration:

```typescript
const nextConfig: NextConfig = {
  // ... existing config
  output: 'standalone', // Add this
};
```

### Step 3: Build and Run

```bash
docker build -t amisag-app .
docker run -p 3000:3000 --env-file .env.local amisag-app
```

---

## 🔧 Post-Deployment Steps

### 1. Run Database Migrations

After deployment, ensure your database schema is up to date:

```bash
# Set environment variables first
export TURSO_CONNECTION_URL="your-production-url"
export TURSO_AUTH_TOKEN="your-production-token"

# Run migrations
npx drizzle-kit push
```

### 2. Verify Environment Variables

Check that all environment variables are set correctly:
- `TURSO_CONNECTION_URL` - Production database URL
- `TURSO_AUTH_TOKEN` - Production database token
- `NEXT_PUBLIC_SITE_URL` - Your production domain
- `RESEND_API_KEY` - (Optional) For email functionality

### 3. Test Your Deployment

1. Visit your production URL
2. Test sign-up/sign-in
3. Test protected routes
4. Check API endpoints

---

## 🔐 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `TURSO_CONNECTION_URL` | ✅ Yes | Turso database connection URL | `libsql://db.turso.io` |
| `TURSO_AUTH_TOKEN` | ✅ Yes | Turso authentication token | `eyJ...` |
| `NEXT_PUBLIC_SITE_URL` | ✅ Yes | Your production site URL | `https://app.vercel.app` |
| `RESEND_API_KEY` | ❌ No | Resend API key for emails | `re_...` |
| `EMAIL_FROM` | ❌ No | Email sender address | `noreply@domain.com` |

---

## 🐛 Troubleshooting

### Build Fails

1. **Check Node.js version**: Ensure platform supports Node 18+
2. **Check build logs**: Look for specific errors
3. **Verify dependencies**: Ensure `package.json` is correct

### Database Connection Issues

1. **Verify Turso credentials**: Check dashboard
2. **Check environment variables**: Ensure they're set correctly
3. **Run migrations**: `npx drizzle-kit push`

### API Routes Not Working

1. **Check `NEXT_PUBLIC_SITE_URL`**: Must match your domain
2. **Verify CORS settings**: If using custom domain
3. **Check server logs**: For specific errors

### Authentication Issues

1. **Verify `NEXT_PUBLIC_SITE_URL`**: Must be exact production URL
2. **Check cookies**: Ensure HTTPS is enabled
3. **Verify bearer tokens**: Check localStorage in browser

---

## 📊 Recommended Platforms Comparison

| Platform | Pros | Cons | Best For |
|----------|------|------|----------|
| **Vercel** | ✅ Easiest Next.js setup<br>✅ Free tier<br>✅ Auto deployments | ❌ Limited serverless functions | Next.js apps |
| **Netlify** | ✅ Good free tier<br>✅ Easy setup | ❌ Next.js requires config | Static sites |
| **Railway** | ✅ Full control<br>✅ Database included | ❌ Paid after free tier | Full-stack apps |
| **Docker** | ✅ Full control<br>✅ Portable | ❌ Requires server management | Self-hosting |

---

## 🎯 Quick Deploy Commands

### Vercel (CLI)
```bash
npm i -g vercel
vercel
```

### Netlify (CLI)
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Railway (CLI)
```bash
npm i -g @railway/cli
railway up
```

---

## 📝 Notes

- **Always use production database** for deployed apps (not `local.db`)
- **Never commit** `.env.local` or `.env` files
- **Use HTTPS** in production (most platforms provide this automatically)
- **Set `NEXT_PUBLIC_SITE_URL`** to your exact production domain
- **Run migrations** after first deployment

---

**Need help?** Check the [Next.js Deployment Docs](https://nextjs.org/docs/deployment) or your platform's documentation.

