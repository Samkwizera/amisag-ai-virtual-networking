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

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY not configured - email will not be sent');
      return NextResponse.json(
        {
          success: false,
          error: 'Email service not configured. RESEND_API_KEY is missing.',
          warning: 'Email not sent - RESEND_API_KEY environment variable is not set',
        },
        { status: 200 } // Return 200 so registration doesn't fail
      );
    }

    // Send welcome email
    console.log('📧 Attempting to send welcome email to:', userData.email);
    const result = await sendWelcomeEmail(userData);
    console.log('✅ Welcome email sent successfully:', result);

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully',
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error('❌ Error sending welcome email:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    // Return success so registration doesn't fail, but log the error
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send welcome email',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 200 } // Return 200 so registration doesn't fail
    );
  }
}

