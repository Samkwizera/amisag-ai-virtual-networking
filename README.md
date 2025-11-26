# Amisag AI Virtual Networking Platform

A modern, AI-powered virtual networking platform built with Next.js, designed to connect professionals across Africa and beyond.

## 📋 Prerequisites

- **Node.js** v18+ - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **Turso Account** (free) - [Sign up](https://turso.tech/)
- **Resend Account** (free, optional) - [Sign up](https://resend.com/)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <https://github.com/Samkwizera/amisag-ai-virtual-networking.git>
cd amisag-ai-virtual-networking
npm install
```

### 2. Set Up Turso Database

1. Sign up at [Turso](https://turso.tech/)
2. Create a new database
3. Copy your **Connection URL** and **Auth Token** from the dashboard

### 3. Set Up Resend (Optional)

1. Sign up at [Resend](https://resend.com/)
2. Create an API key
3. Copy the API key

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
TURSO_CONNECTION_URL=libsql://your-db-name-xxxxx.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token_here

# Email Configuration (Optional)
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM=onboarding@resend.dev

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important**: Replace the placeholder values with your actual credentials.

### 5. Set Up Database Schema

```bash
npx drizzle-kit push
```

This creates all necessary database tables.

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/              # Next.js pages and API routes
│   ├── profile/     # Protected profile section
│   ├── login/       # Authentication pages
│   └── api/         # API endpoints
├── components/      # React components
├── db/              # Database schema and config
└── lib/             # Utilities (auth, email, etc.)
```

## 🎨 Features

- User authentication with session management
- Profile management with skills and goals
- Messaging system with communities
- Professional networking and discovery
- Insights dashboard
- Mobile responsive design

## 🔐 Key Routes

**Public**: `/`, `/login`, `/register`  
**Protected**: `/profile/dashboard`, `/profile/connect`, `/profile/messages`, `/profile/communities`, `/profile/insights`, `/profile/account`

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` in `.env.local`
- Ensure database is active in Turso dashboard
- Run `npx drizzle-kit push` again

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm run dev
```

### Environment Variables Not Loading
- File must be named exactly `.env.local` (in root directory)
- Restart dev server after changes
- No quotes around values
- Check for typos (case-sensitive)

### Module Not Found Errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Resend free tier only sends to verified emails during development
- Check Resend dashboard logs

## 🛠️ Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Turso (libSQL)
- **ORM**: Drizzle ORM
- **Auth**: better-auth
- **Email**: Resend
- **UI**: shadcn/ui

## 📝 Notes

- Uses Turbopack for faster development builds
- Environment variables are loaded from `.env.local` (not committed)
- Authentication uses bearer tokens stored in localStorage
- Protected routes automatically redirect to login if not authenticated

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and proprietary. by Samuel Ihimbazwe 

---

**Happy Networking! 🚀**
