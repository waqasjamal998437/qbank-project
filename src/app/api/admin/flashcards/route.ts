import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function GET() {
  try {
    const flashcards = await db.flashcard.findMany();

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json([], { status: 200 });
  }
}
