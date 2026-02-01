import { db } from "../../../lib/db";
import { NextResponse } from "next/server";
import { mockQuestions } from "../../../data/mockQuestions";
import { subDays, startOfDay, format, isSameDay } from "date-fns";

export async function GET() {
  try {
    // Fetch all user progress records with error handling
    let progress;
    try {
      progress = await db.userProgress.findMany({
        orderBy: { lastSeen: "desc" },
      });
    } catch (dbError: any) {
      console.error("❌ DATABASE ERROR:", {
        message: dbError.message,
        code: dbError.code,
      });
      // Return empty data structure if database fails (200 status, not 500)
      return NextResponse.json({
        activity: [
          { day: "Mon", count: 0 },
          { day: "Tue", count: 0 },
          { day: "Wed", count: 0 },
          { day: "Thu", count: 0 },
          { day: "Fri", count: 0 },
          { day: "Sat", count: 0 },
          { day: "Sun", count: 0 },
        ],
        accuracy: 0,
        categories: [],
        total: 0,
        todayCount: 0,
      }, { status: 200 });
    }

    const total = progress.length;
    const correct = progress.filter((p) => p.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // 1. Activity: Always return 7 days, gap-fill with 0s if no data
    const activity: { day: string; count: number }[] = [];
    try {
      const today = startOfDay(new Date());

      // Generate last 7 days using date-fns
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dayName = format(date, "EEE"); // "Mon", "Tue", etc.

        // Count questions answered on this specific day
        const count = progress.filter((p) => {
          try {
            const lastSeen = startOfDay(new Date(p.lastSeen));
            return isSameDay(lastSeen, date);
          } catch {
            return false;
          }
        }).length;

        activity.push({
          day: dayName,
          count,
        });
      }
    } catch (dateError: any) {
      console.error("❌ DATE PROCESSING ERROR:", dateError);
      // Fallback: generate 7 days with 0 counts
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      for (let i = 0; i < 7; i++) {
        activity.push({ day: days[i], count: 0 });
      }
    }

    // Calculate today's count for dashboard
    let todayCount = 0;
    try {
      const today = startOfDay(new Date());
      todayCount = progress.filter((p) => {
        try {
          const lastSeen = startOfDay(new Date(p.lastSeen));
          return isSameDay(lastSeen, today);
        } catch {
          return false;
        }
      }).length;
    } catch {
      todayCount = 0;
    }

    // Handle empty database case
    if (progress.length === 0) {
      return NextResponse.json({
        activity,
        accuracy: 0,
        categories: [],
        total: 0,
        todayCount: 0,
      });
    }

    // Create a map of questionId to category for quick lookup
    const questionCategoryMap = new Map<string, string>();
    mockQuestions.forEach((q) => {
      questionCategoryMap.set(q.id, q.category);
    });

    // 3. Categories: Array of { name: string, score: number } representing accuracy per subject
    const categoryStats: Record<string, { total: number; correct: number }> = {};

    progress.forEach((p) => {
      const category = questionCategoryMap.get(p.questionId) || "Unknown";
      if (!categoryStats[category]) {
        categoryStats[category] = { total: 0, correct: 0 };
      }
      categoryStats[category].total++;
      if (p.isCorrect) {
        categoryStats[category].correct++;
      }
    });

    // Convert to array format with score (accuracy percentage)
    const categories = Object.entries(categoryStats)
      .map(([name, stats]) => ({
        name,
        score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      }))
      .sort((a, b) => b.score - a.score); // Sort by score descending

    return NextResponse.json({
      activity,
      accuracy,
      categories,
      total,
      todayCount,
    });
  } catch (error: any) {
    console.error("❌ STATS FETCH ERROR:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    // Return empty data structure instead of 500 error
    return NextResponse.json({
      activity: [
        { day: "Mon", count: 0 },
        { day: "Tue", count: 0 },
        { day: "Wed", count: 0 },
        { day: "Thu", count: 0 },
        { day: "Fri", count: 0 },
        { day: "Sat", count: 0 },
        { day: "Sun", count: 0 },
      ],
      accuracy: 0,
      categories: [],
      total: 0,
      todayCount: 0,
    }, { status: 200 });
  }
}
