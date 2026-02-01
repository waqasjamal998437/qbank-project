import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function GET() {
  try {
    const [flashcards, videos, quizzes] = await Promise.all([
      db.flashcard.count(),
      db.video.count(),
      db.quiz.count(),
    ]);

    return NextResponse.json({
      flashcards,
      videos,
      quizzes,
      totalContent: flashcards + videos + quizzes,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { flashcards: 0, videos: 0, quizzes: 0, totalContent: 0 },
      { status: 200 }
    );
  }
}
