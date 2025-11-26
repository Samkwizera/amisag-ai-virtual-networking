import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { session } from '@/db/schema';
import { eq, desc, and, gt } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get the current session from better-auth using request headers (includes cookies)
    const sessionData = await auth.api.getSession({ 
      headers: request.headers 
    });

    if (!sessionData?.session?.userId) {
      console.error('No session found. Session data:', sessionData);
      return NextResponse.json(
        { error: 'No active session', details: 'Please sign in first' },
        { status: 401 }
      );
    }

    const userId = sessionData.session.userId;

    // Get the most recent session token from database
    // Optimized: Get most recent first, then check expiration
    const sessionRecord = await db
      .select()
      .from(session)
      .where(eq(session.userId, userId))
      .orderBy(desc(session.createdAt))
      .limit(1);

    if (sessionRecord.length === 0) {
      console.error(`No sessions found for userId: ${userId}`);
      return NextResponse.json(
        { error: 'No session found in database', userId },
        { status: 404 }
      );
    }

    const userSession = sessionRecord[0];
    const now = new Date();
    
    // Check if expired
    if (userSession.expiresAt <= now) {
      console.warn(`Session expired for userId: ${userId}, but returning token anyway`);
      // Return token anyway - let the client handle expiration
    }

    // Return the token
    return NextResponse.json({
      token: userSession.token,
      userId: userId
    });
  } catch (error) {
    console.error('Error getting token:', error);
    return NextResponse.json(
      { error: 'Failed to get token' },
      { status: 500 }
    );
  }
}

