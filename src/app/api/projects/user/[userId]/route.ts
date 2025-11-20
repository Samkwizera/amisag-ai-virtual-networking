import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, desc, asc, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);

    // Validate userId
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return NextResponse.json(
        {
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    // Parse pagination parameters
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const limit = limitParam ? Math.min(parseInt(limitParam), 100) : 10;
    const offset = offsetParam ? parseInt(offsetParam) : 0;

    // Validate pagination parameters
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        {
          error: 'Invalid limit parameter. Must be a positive number.',
          code: 'INVALID_LIMIT',
        },
        { status: 400 }
      );
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        {
          error: 'Invalid offset parameter. Must be a non-negative number.',
          code: 'INVALID_OFFSET',
        },
        { status: 400 }
      );
    }

    // Parse filter parameters
    const statusFilter = searchParams.get('status');
    const categoryFilter = searchParams.get('category');

    // Parse sort parameters
    const sortField = searchParams.get('sort') || 'createdAt';
    const sortOrder = searchParams.get('order') || 'desc';

    // Validate sort order
    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      return NextResponse.json(
        {
          error: 'Invalid sort order. Must be "asc" or "desc".',
          code: 'INVALID_SORT_ORDER',
        },
        { status: 400 }
      );
    }

    // Validate sort field exists in projects table
    const validSortFields = ['id', 'name', 'role', 'category', 'status', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(sortField)) {
      return NextResponse.json(
        {
          error: `Invalid sort field. Must be one of: ${validSortFields.join(', ')}`,
          code: 'INVALID_SORT_FIELD',
        },
        { status: 400 }
      );
    }

    // Build where conditions
    const conditions = [eq(projects.userId, userId)];

    if (statusFilter) {
      conditions.push(eq(projects.status, statusFilter));
    }

    if (categoryFilter) {
      conditions.push(eq(projects.category, categoryFilter));
    }

    // Build query
    let query = db
      .select()
      .from(projects)
      .where(and(...conditions));

    // Apply sorting
    const sortColumn = projects[sortField as keyof typeof projects];
    query = sortOrder === 'desc' 
      ? query.orderBy(desc(sortColumn))
      : query.orderBy(asc(sortColumn));

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET /api/projects/user/[userId] error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}