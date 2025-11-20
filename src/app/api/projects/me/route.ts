import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, session } from '@/db/schema';
import { eq, like, or, and, desc, asc, gt } from 'drizzle-orm';

async function validateSession(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return null;
    }

    const sessionRecords = await db.select()
      .from(session)
      .where(
        and(
          eq(session.token, token),
          gt(session.expiresAt, new Date())
        )
      )
      .limit(1);

    if (sessionRecords.length === 0) {
      return null;
    }

    return sessionRecords[0];
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userSession = await validateSession(request);
    
    if (!userSession) {
      return NextResponse.json(
        { 
          error: 'Authentication required. Please provide a valid bearer token.',
          code: 'AUTHENTICATION_REQUIRED'
        }, 
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const sortField = searchParams.get('sort') ?? 'createdAt';
    const sortOrder = searchParams.get('order') ?? 'desc';

    const conditions = [eq(projects.userId, userSession.userId)];

    if (status) {
      conditions.push(eq(projects.status, status));
    }

    if (category) {
      conditions.push(eq(projects.category, category));
    }

    if (search) {
      const searchCondition = or(
        like(projects.name, `%${search}%`),
        like(projects.role, `%${search}%`),
        like(projects.description, `%${search}%`),
        like(projects.category, `%${search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const whereCondition = conditions.length > 1 ? and(...conditions) : conditions[0];

    let query = db.select().from(projects).where(whereCondition);

    const validSortFields = ['id', 'name', 'role', 'category', 'status', 'createdAt', 'updatedAt'];
    const orderByField = validSortFields.includes(sortField) ? sortField : 'createdAt';
    const orderByColumn = projects[orderByField as keyof typeof projects];

    if (sortOrder === 'asc') {
      query = query.orderBy(asc(orderByColumn));
    } else {
      query = query.orderBy(desc(orderByColumn));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR'
      }, 
      { status: 500 }
    );
  }
}