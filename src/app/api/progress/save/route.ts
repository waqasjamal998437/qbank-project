import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { SaveExamSessionRequest, SaveExamSessionResponse } from '@/types/database';

// POST /api/progress/save - Save exam session progress
export async function POST(request: NextRequest) {
  try {
    const body: SaveExamSessionRequest = await request.json();

    // Validate required fields
    if (!body.user_id || !body.mode || !body.question_ids) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, mode, question_ids' },
        { status: 400 }
      );
    }

    const now = new Date();

    // Upsert exam session (create if not exists, update if exists)
    const session = await db.examSession.upsert({
      where: {
        id: body.session_id || 'new-session',
      },
      create: {
        id: body.session_id || undefined, // Will generate UUID if undefined
        user_id: body.user_id,
        mode: body.mode,
        question_ids: body.question_ids,
        current_index: body.current_index,
        responses: body.responses as any, // JSON type
        time_remaining: body.time_remaining,
        started_at: now,
        last_saved_at: now,
        is_completed: false,
      },
      update: {
        current_index: body.current_index,
        responses: body.responses as any,
        time_remaining: body.time_remaining,
        last_saved_at: now,
        is_completed: false,
      },
    });

    const response: SaveExamSessionResponse = {
      session_id: session.id,
      saved_at: session.last_saved_at.toISOString(),
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error saving exam session:', error);
    return NextResponse.json(
      { error: 'Failed to save exam session' },
      { status: 500 }
    );
  }
}

// GET /api/progress/save - Get exam session by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const userId = searchParams.get('user_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    const session = await db.examSession.findFirst({
      where: {
        id: sessionId,
        ...(userId ? { user_id: userId } : {}),
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...session,
      responses: session.responses as Record<string, any>,
    });

  } catch (error) {
    console.error('Error fetching exam session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam session' },
      { status: 500 }
    );
  }
}
