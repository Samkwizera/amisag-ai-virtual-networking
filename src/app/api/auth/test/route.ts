import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    // Test if auth is properly configured
    const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    return NextResponse.json({
      success: true,
      message: 'Auth API is working',
      baseURL: baseURL,
      hasDatabase: !!auth,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Auth test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}


