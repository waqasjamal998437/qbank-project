import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subDays, startOfDay, format, parseISO } from 'date-fns';
import type { GetAnalyticsResponse, SystemPerformance } from '@/types/database';

// GET /api/analytics - Get user performance analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Get all user responses
    const userResponses = await db.userResponse.findMany({
      where: { user_id: userId },
      include: {
        question: {
          select: {
            system_tag: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Calculate overall stats
    const totalQuestions = userResponses.length;
    const correctCount = userResponses.filter(r => r.is_correct).length;
    const accuracyPercentage = totalQuestions > 0 
      ? Math.round((correctCount / totalQuestions) * 100) 
      : 0;
    const avgTimeMs = totalQuestions > 0 
      ? Math.round(userResponses.reduce((sum, r) => sum + r.time_spent_ms, 0) / totalQuestions)
      : 0;

    // Calculate performance by system
    const systemMap = new Map<string, { total: number; correct: number; timeSum: number }>();
    
    for (const response of userResponses) {
      const system = response.question.system_tag || 'Unknown';
      const existing = systemMap.get(system) || { total: 0, correct: 0, timeSum: 0 };
      systemMap.set(system, {
        total: existing.total + 1,
        correct: existing.correct + (response.is_correct ? 1 : 0),
        timeSum: existing.timeSum + response.time_spent_ms,
      });
    }

    const bySystem: SystemPerformance[] = Array.from(systemMap.entries()).map(([system, data]) => ({
      system_tag: system,
      total: data.total,
      correct: data.correct,
      accuracy_percentage: Math.round((data.correct / data.total) * 100),
      avg_time_ms: Math.round(data.timeSum / data.total),
    }));

    // Calculate daily activity for last 7 days
    const today = startOfDay(new Date());
    const activity: { date: string; count: number; accuracy: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayResponses = userResponses.filter(r => {
        const responseDate = startOfDay(parseISO(r.created_at.toString()));
        return responseDate.getTime() === date.getTime();
      });

      const dayCount = dayResponses.length;
      const dayCorrect = dayResponses.filter(r => r.is_correct).length;
      const dayAccuracy = dayCount > 0 ? Math.round((dayCorrect / dayCount) * 100) : 0;

      activity.push({
        date: format(date, 'MMM d'),
        count: dayCount,
        accuracy: dayAccuracy,
      });
    }

    const response: GetAnalyticsResponse = {
      user_id: userId,
      overall_stats: {
        total_questions: totalQuestions,
        correct_count: correctCount,
        accuracy_percentage: accuracyPercentage,
        avg_time_ms: avgTimeMs,
      },
      by_system: bySystem.sort((a, b) => b.total - a.total),
      recent_activity: activity,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
