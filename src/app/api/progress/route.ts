import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, isCorrect, confidence } = body;

    // Validate input
    if (!questionId || typeof isCorrect !== "boolean" || !confidence) {
      return NextResponse.json(
        { error: "Missing required fields: questionId, isCorrect, confidence" },
        { status: 400 }
      );
    }

    // Validate confidence value
    const validConfidences = ["not-sure", "somewhat-sure", "highly-confident"];
    if (!validConfidences.includes(confidence)) {
      return NextResponse.json(
        { error: "Invalid confidence value" },
        { status: 400 }
      );
    }

    // Upsert the progress record
    const progress = await db.userProgress.upsert({
      where: { questionId },
      update: {
        isCorrect,
        confidence,
        lastSeen: new Date(),
      },
      create: {
        questionId,
        isCorrect,
        confidence,
        lastSeen: new Date(),
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error: any) {
    console.error("❌ PROGRESS SAVE ERROR:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: error.message || "Failed to save progress" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const progress = await db.userProgress.findMany({
      orderBy: { lastSeen: "desc" },
    });

    // Calculate stats
    const total = progress.length;
    const correct = progress.filter((p) => p.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Count by confidence
    const confidenceCounts = {
      "not-sure": progress.filter((p) => p.confidence === "not-sure").length,
      "somewhat-sure": progress.filter((p) => p.confidence === "somewhat-sure").length,
      "highly-confident": progress.filter((p) => p.confidence === "highly-confident").length,
    };

    // Get today's count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = progress.filter(
      (p) => new Date(p.lastSeen) >= today
    ).length;

    return NextResponse.json({
      total,
      correct,
      accuracy,
      todayCount,
      confidenceCounts,
      progress,
    });
  } catch (error: any) {
    console.error("❌ PROGRESS FETCH ERROR:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    return NextResponse.json(
      { error: error.message || "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
