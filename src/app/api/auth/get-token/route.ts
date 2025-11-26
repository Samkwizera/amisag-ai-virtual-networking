import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { session } from '@/db/schema';
import { eq, desc, and, gt } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get cookies from Next.js cookies() helper
    const cookieStore = await cookies();
    
    // Build headers object with cookies for better-auth
    const headersObj = new Headers();
    
    // Copy all request headers
    request.headers.forEach((value, key) => {
      headersObj.set(key, value);
    });
    
    // Ensure cookies are included (cookies() helper provides them)
    const cookieHeader = cookieStore.toString();
    if (cookieHeader) {
      headersObj.set('cookie', cookieHeader);
    }

    // Get the current session from better-auth using request headers (includes cookies)
    const sessionData = await auth.api.getSession({ 
      headers: headersObj 
    });

    if (!sessionData?.session?.userId) {
      console.error('No session found. Session data:', {
        hasSession: !!sessionData?.session,
        hasUserId: !!sessionData?.session?.userId,
        sessionData: sessionData,
        cookieHeader: request.headers.get('cookie') ? 'present' : 'missing'
      });
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

