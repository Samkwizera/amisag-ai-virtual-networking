import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, session } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

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
      .where(
        and(
          eq(session.token, token),
          gt(session.expiresAt, new Date())
        )
      )
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userSession = await validateSession(request);
    if (!userSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid project ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const projectId = parseInt(id);

    const existingProjects = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, projectId),
          eq(projects.userId, userSession.userId)
        )
      )
      .limit(1);

    if (existingProjects.length === 0) {
      return NextResponse.json(
        { error: 'Project not found', code: 'PROJECT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: Record<string, any> = {};

    if (body.name !== undefined) {
      const trimmedName = body.name.trim();
      if (!trimmedName) {
        return NextResponse.json(
          { error: 'Name cannot be empty', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = trimmedName;
    }

    if (body.role !== undefined) {
      const trimmedRole = body.role.trim();
      if (!trimmedRole) {
        return NextResponse.json(
          { error: 'Role cannot be empty', code: 'INVALID_ROLE' },
          { status: 400 }
        );
      }
      updates.role = trimmedRole;
    }

    if (body.description !== undefined) {
      const trimmedDescription = body.description.trim();
      if (!trimmedDescription) {
        return NextResponse.json(
          { error: 'Description cannot be empty', code: 'INVALID_DESCRIPTION' },
          { status: 400 }
        );
      }
      updates.description = trimmedDescription;
    }

    if (body.link !== undefined) {
      if (body.link) {
        const trimmedLink = body.link.trim();
        try {
          new URL(trimmedLink);
          updates.link = trimmedLink;
        } catch {
          return NextResponse.json(
            { error: 'Invalid URL format for link', code: 'INVALID_URL' },
            { status: 400 }
          );
        }
      } else {
        updates.link = null;
      }
    }

    if (body.category !== undefined) {
      const trimmedCategory = body.category.trim();
      if (!trimmedCategory) {
        return NextResponse.json(
          { error: 'Category cannot be empty', code: 'INVALID_CATEGORY' },
          { status: 400 }
        );
      }
      updates.category = trimmedCategory;
    }

    if (body.status !== undefined) {
      const trimmedStatus = body.status.trim();
      if (!trimmedStatus) {
        return NextResponse.json(
          { error: 'Status cannot be empty', code: 'INVALID_STATUS' },
          { status: 400 }
        );
      }
      updates.status = trimmedStatus;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    updates.updatedAt = new Date();

    const updatedProject = await db
      .update(projects)
      .set(updates)
      .where(
        and(
          eq(projects.id, projectId),
          eq(projects.userId, userSession.userId)
        )
      )
      .returning();

    if (updatedProject.length === 0) {
      return NextResponse.json(
        { error: 'Project not found', code: 'PROJECT_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProject[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userSession = await validateSession(request);
    if (!userSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid project ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const projectId = parseInt(id);

    const existingProjects = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, projectId),
          eq(projects.userId, userSession.userId)
        )
      )
      .limit(1);

    if (existingProjects.length === 0) {
      return NextResponse.json(
        { error: 'Project not found', code: 'PROJECT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(projects)
      .where(
        and(
          eq(projects.id, projectId),
          eq(projects.userId, userSession.userId)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Project not found', code: 'PROJECT_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Project deleted successfully', id: projectId },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}