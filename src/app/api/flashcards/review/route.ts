import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateSM2, getNextReviewDate } from '@/lib/sm2';
import type { ReviewCardRequest, ReviewCardResponse, SM2Quality } from '@/types/database';

// POST /api/flashcards/review - Process flashcard review with SM2 algorithm
export async function POST(request: NextRequest) {
  try {
    const body: ReviewCardRequest = await request.json();

    // Validate required fields
    if (!body.card_id || body.quality === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: card_id, quality' },
        { status: 400 }
      );
    }

    // Validate quality range
    if (body.quality < 0 || body.quality > 5) {
      return NextResponse.json(
        { error: 'Quality must be between 0 and 5' },
        { status: 400 }
      );
    }

    // Get the flashcard
    const card = await db.flashcard.findUnique({
      where: { id: body.card_id },
    });

    if (!card) {
      return NextResponse.json(
        { error: 'Flashcard not found' },
        { status: 404 }
      );
    }

    // Calculate new SM2 values
    const sm2Result = calculateSM2(
      card.repetitions,
      card.ease_factor,
      body.quality as SM2Quality
    );

    // Calculate next review date
    const nextReviewDate = getNextReviewDate(sm2Result);

    // Update the flashcard
    const updatedCard = await db.flashcard.update({
      where: { id: body.card_id },
      data: {
        next_review_date: nextReviewDate,
        interval: sm2Result.interval,
        ease_factor: sm2Result.easeFactor,
        repetitions: sm2Result.repetitions,
        last_reviewed_at: new Date(),
      },
    });

    const response: ReviewCardResponse = {
      card_id: updatedCard.id,
      next_review_date: updatedCard.next_review_date.toISOString(),
      interval: updatedCard.interval,
      ease_factor: updatedCard.ease_factor,
      repetitions: updatedCard.repetitions,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error processing flashcard review:', error);
    return NextResponse.json(
      { error: 'Failed to process flashcard review' },
      { status: 500 }
    );
  }
}

// GET /api/flashcards/review - Get flashcards due for review
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: Record<string, any> = {
      next_review_date: {
        lte: new Date(), // Cards due now or in the past
      },
    };

    // If user_id provided, get user's cards, otherwise get system cards
    if (userId) {
      where.OR = [
        { user_id: userId },
        { user_id: null }, // Include system-wide cards
      ];
    }

    const cards = await db.flashcard.findMany({
      where,
      orderBy: { next_review_date: 'asc' },
      take: limit,
    });

    return NextResponse.json({
      cards: cards.map(card => ({
        ...card,
        next_review_date: card.next_review_date.toISOString(),
        created_at: card.created_at.toISOString(),
        updated_at: card.updated_at.toISOString(),
        last_reviewed_at: card.last_reviewed_at?.toISOString() || null,
      })),
      count: cards.length,
    });

  } catch (error) {
    console.error('Error fetching flashcards for review:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
}
