import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, session } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

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

export async function GET(request: NextRequest) {
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

    // Query user table to get full profile
    const userProfile = await db.select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userProfile.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(userProfile[0], { status: 200 });
  } catch (error) {
    console.error('GET /api/profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();

    // Allowed fields for profile update
    const allowedFields = [
      'bio', 'location', 'role', 'company', 'skills', 'goals', 
      'industries', 'linkedinUrl', 'portfolioUrl', 'profileImage', 
      'name', 'image'
    ];

    // Filter and validate update data
    const updates: Record<string, any> = {};

    for (const [key, value] of Object.entries(body)) {
      if (!allowedFields.includes(key)) {
        continue; // Skip fields not in allowed list
      }

      // Validate JSON array fields
      if (['skills', 'goals', 'industries'].includes(key)) {
        if (value !== null && value !== undefined) {
          try {
            // If it's already an array, validate it
            if (Array.isArray(value)) {
              updates[key] = JSON.stringify(value);
            } else if (typeof value === 'string') {
              // Try to parse if it's a string
              const parsed = JSON.parse(value);
              if (!Array.isArray(parsed)) {
                return NextResponse.json(
                  { error: `${key} must be a JSON array`, code: 'INVALID_JSON_ARRAY' },
                  { status: 400 }
                );
              }
              updates[key] = value;
            } else {
              return NextResponse.json(
                { error: `${key} must be a JSON array`, code: 'INVALID_JSON_ARRAY' },
                { status: 400 }
              );
            }
          } catch (error) {
            return NextResponse.json(
              { error: `Invalid JSON format for ${key}`, code: 'INVALID_JSON' },
              { status: 400 }
            );
          }
        } else {
          updates[key] = value;
        }
        continue;
      }

      // Validate URL fields
      if (['linkedinUrl', 'portfolioUrl'].includes(key)) {
        if (value !== null && value !== undefined && value !== '') {
          try {
            new URL(value);
            updates[key] = value;
          } catch (error) {
            return NextResponse.json(
              { error: `Invalid URL format for ${key}`, code: 'INVALID_URL' },
              { status: 400 }
            );
          }
        } else {
          updates[key] = value;
        }
        continue;
      }

      // Trim string values
      if (typeof value === 'string') {
        updates[key] = value.trim();
      } else {
        updates[key] = value;
      }
    }

    // If no valid updates, return error
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_VALID_FIELDS' },
        { status: 400 }
      );
    }

    // Always update updatedAt timestamp
    updates.updatedAt = new Date();

    // Update user profile
    const updatedProfile = await db.update(user)
      .set(updates)
      .where(eq(user.id, userId))
      .returning();

    if (updatedProfile.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProfile[0], { status: 200 });
  } catch (error) {
    console.error('PATCH /api/profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}