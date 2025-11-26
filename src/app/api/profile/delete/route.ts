import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, session, account, projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Helper function to validate and extract token from Authorization header
async function validateSession(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return { error: 'Authorization header missing', status: 401 };
  }

  if (!authHeader.startsWith('Bearer ')) {
    return { error: 'Invalid Authorization header format', status: 401 };
  }

  const token = authHeader.substring(7).trim();
  
  if (!token) {
    return { error: 'Token missing from Authorization header', status: 401 };
  }

  try {
    // Query session table to validate token
    const sessionRecord = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionRecord.length === 0) {
      return { error: 'Invalid session token', status: 401 };
    }

    const userSession = sessionRecord[0];

    // Check if session is expired
    const now = new Date();
    if (userSession.expiresAt <= now) {
      return { error: 'Session expired', status: 401 };
    }

    return { userId: userSession.userId };
  } catch (error) {
    console.error('Session validation error:', error);
    return { error: 'Session validation failed', status: 500 };
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Validate session and get userId
    const validationResult = await validateSession(request);
    
    if ('error' in validationResult) {
      return NextResponse.json(
        { error: validationResult.error, code: 'AUTHENTICATION_FAILED' },
        { status: validationResult.status }
      );
    }

    const { userId } = validationResult;

    // Verify user exists
    const userRecord = await db.select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userRecord.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete user's projects first (due to foreign key constraint)
    await db.delete(projects)
      .where(eq(projects.userId, userId));

    // Delete user's accounts (due to foreign key constraint)
    await db.delete(account)
      .where(eq(account.userId, userId));

    // Delete user's sessions (due to foreign key constraint)
    await db.delete(session)
      .where(eq(session.userId, userId));

    // Finally, delete the user
    await db.delete(user)
      .where(eq(user.id, userId));

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/profile/delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

