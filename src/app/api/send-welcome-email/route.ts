import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, name } = body;

    let userData: { name: string; email: string };

    // If userId is provided, fetch from database
    if (userId) {
      const users = await db.select().from(user).where(eq(user.id, userId)).limit(1);
      
      if (users.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      userData = {
        name: users[0].name,
        email: users[0].email,
      };
    } 
    // Otherwise use provided email and name
    else if (email && name) {
      userData = { name, email };
    } 
    else {
      return NextResponse.json(
        { error: 'Either userId or (email and name) is required' },
        { status: 400 }
      );
    }

    // Send welcome email
    await sendWelcomeEmail(userData);

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully',
    });
  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send welcome email',
      },
      { status: 500 }
    );
  }
}

