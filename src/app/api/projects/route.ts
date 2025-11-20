import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, session } from '@/db/schema';
import { eq, like, or, desc, asc, and, gt } from 'drizzle-orm';

async function validateSession(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const sessions = await db
      .select()
      .from(session)
      .where(and(
        eq(session.token, token),
        gt(session.expiresAt, new Date())
      ))
      .limit(1);

    if (sessions.length === 0) {
      return null;
    }

    return sessions[0];
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
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const sortField = searchParams.get('sort') ?? 'createdAt';
    const sortOrder = searchParams.get('order') ?? 'desc';

    let query = db.select().from(projects).where(eq(projects.userId, userSession.userId));

    const conditions = [eq(projects.userId, userSession.userId)];

    if (search) {
      const searchCondition = or(
        like(projects.name, `%${search}%`),
        like(projects.role, `%${search}%`),
        like(projects.description, `%${search}%`),
        like(projects.category, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    if (status) {
      conditions.push(eq(projects.status, status));
    }

    if (category) {
      conditions.push(eq(projects.category, category));
    }

    query = db.select().from(projects).where(and(...conditions));

    if (sortField === 'createdAt') {
      query = sortOrder === 'asc' 
        ? query.orderBy(asc(projects.createdAt))
        : query.orderBy(desc(projects.createdAt));
    } else if (sortField === 'updatedAt') {
      query = sortOrder === 'asc'
        ? query.orderBy(asc(projects.updatedAt))
        : query.orderBy(desc(projects.updatedAt));
    } else if (sortField === 'name') {
      query = sortOrder === 'asc'
        ? query.orderBy(asc(projects.name))
        : query.orderBy(desc(projects.name));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userSession = await validateSession(request);
    if (!userSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        { error: 'User ID cannot be provided in request body', code: 'USER_ID_NOT_ALLOWED' },
        { status: 400 }
      );
    }

    const { name, role, description, category, link, status } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }

    if (!role || typeof role !== 'string' || role.trim() === '') {
      return NextResponse.json(
        { error: 'Role is required and must be a non-empty string', code: 'INVALID_ROLE' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required and must be a non-empty string', code: 'INVALID_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json(
        { error: 'Category is required and must be a non-empty string', code: 'INVALID_CATEGORY' },
        { status: 400 }
      );
    }

    if (link && typeof link === 'string' && link.trim() !== '') {
      try {
        new URL(link.trim());
      } catch {
        return NextResponse.json(
          { error: 'Link must be a valid URL', code: 'INVALID_LINK' },
          { status: 400 }
        );
      }
    }

    const now = new Date();
    const newProject = await db
      .insert(projects)
      .values({
        userId: userSession.userId,
        name: name.trim(),
        role: role.trim(),
        description: description.trim(),
        category: category.trim(),
        link: link && typeof link === 'string' ? link.trim() : null,
        status: status && typeof status === 'string' ? status.trim() : 'active',
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}