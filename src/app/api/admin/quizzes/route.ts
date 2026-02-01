import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function GET() {
  try {
    const quizzes = await db.quiz.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json([], { status: 200 });
  }
}
