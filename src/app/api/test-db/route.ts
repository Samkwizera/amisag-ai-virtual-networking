import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, account, session } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Check database connection by querying users
    const users = await db.select().from(user).orderBy(desc(user.createdAt)).limit(10);
    
    // Get account count
    const accounts = await db.select().from(account).limit(10);
    
    // Get session count
    const sessions = await db.select().from(session).limit(10);

    return NextResponse.json({
      success: true,
      database: 'connected',
      stats: {
        totalUsers: users.length,
        totalAccounts: accounts.length,
        totalSessions: sessions.length,
      },
      recentUsers: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        emailVerified: u.emailVerified,
      })),
      accounts: accounts.map(a => ({
        id: a.id,
        userId: a.userId,
        providerId: a.providerId,
        createdAt: a.createdAt,
      })),
      sessions: sessions.map(s => ({
        id: s.id,
        userId: s.userId,
        expiresAt: s.expiresAt,
        createdAt: s.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Database connection failed',
      details: error.toString(),
    }, { status: 500 });
  }
}

