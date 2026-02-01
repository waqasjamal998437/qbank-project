import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Question, Option } from '@/types/database';

// GET /api/questions - Get questions with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const system = searchParams.get('system') || undefined;
    const discipline = searchParams.get('discipline') || undefined;
    const unused = searchParams.get('unused') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: Record<string, any> = {};

    if (system) {
      where.system_tag = system;
    }

    if (discipline) {
      where.discipline_tag = discipline;
    }

    // Note: For unused questions filtering, you'd need user_id from auth
    // This would use a NOT EXISTS clause to exclude answered questions

    // Get total count using Prisma's count
    const total = await db.question.count({ where });

    // Get questions with options
    const questions = await db.question.findMany({
      where,
      include: {
        options: {
          orderBy: { option_index: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
    });

    const response = {
      questions: questions.map((q: any) => ({
        ...q,
        difficulty: q.difficulty as 'easy' | 'medium' | 'hard' | null,
      })),
      total,
      hasMore: offset + limit < total,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
