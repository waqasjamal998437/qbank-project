// ============================================================================
// SM2 Spaced Repetition Algorithm Implementation
// Based on the SuperMemo 2 algorithm by Piotr Wozniak
// ============================================================================

import type { SM2Quality, SM2Result } from '@/types/database';

/**
 * Calculate the next review parameters using the SM2 algorithm.
 * 
 * @param currentRepetitions - Number of successful reviews so far
 * @param currentEaseFactor - Current ease factor (starts at 2.5)
 * @param quality - Quality of recall (0-5):
 *   0 - Complete blackout, wrong answer
 *   1 - Incorrect but upon seeing correct answer remembered
 *   2 - Correct but with serious difficulty
 *   3 - Correct with some hesitation
 *   4 - Perfect recall with no effort
 *   5 - Perfect recall with no effort (overwhelmingly easy)
 * 
 * @returns Object containing new interval (days), ease factor, and repetitions
 */
export function calculateSM2(
  currentRepetitions: number,
  currentEaseFactor: number,
  quality: SM2Quality
): SM2Result {
  // Validate inputs
  if (quality < 0 || quality > 5) {
    throw new Error('Quality must be between 0 and 5');
  }

  // SM2 ease factor formula:
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  // where q is quality rating
  let newEaseFactor = currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ease factor should never go below 1.3
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  let newRepetitions: number;
  let newInterval: number;

  if (quality < 3) {
    // If quality is less than 3, reset repetitions (failed review)
    newRepetitions = 0;
    newInterval = 1; // Review again tomorrow
  } else {
    // Successful recall
    newRepetitions = currentRepetitions + 1;

    // Calculate new interval based on repetitions
    switch (newRepetitions) {
      case 1:
        newInterval = 1; // 1 day
        break;
      case 2:
        newInterval = 6; // 6 days
        break;
      default:
        // For subsequent repetitions: interval = previous_interval * ease_factor
        newInterval = Math.round(currentRepetitions === 0 ? 1 : currentRepetitions * newEaseFactor);
        break;
    }
  }

  return {
    interval: newInterval,
    easeFactor: Math.round(newEaseFactor * 100) / 100, // Round to 2 decimal places
    repetitions: newRepetitions,
  };
}

/**
 * Calculate the next review date based on the SM2 result.
 * 
 * @param sm2Result - The result from calculateSM2
 * @param fromDate - The date to calculate from (default: now)
 * @returns Date string in ISO format
 */
export function getNextReviewDate(sm2Result: SM2Result, fromDate: Date = new Date()): string {
  const nextDate = new Date(fromDate);
  nextDate.setDate(nextDate.getDate() + sm2Result.interval);
  return nextDate.toISOString();
}

/**
 * Quality rating labels for UI
 */
export const SM2_QUALITY_LABELS: Record<SM2Quality, string> = {
  0: 'Again',
  1: 'Hard',
  2: 'Hard',
  3: 'Good',
  4: 'Easy',
  5: 'Very Easy',
};

/**
 * Quality rating descriptions for UI
 */
export const SM2_QUALITY_DESCRIPTIONS: Record<SM2Quality, string> = {
  0: 'Complete blackout - I didn\'t know the answer',
  1: 'Incorrect but I remembered after seeing the answer',
  2: 'Correct with significant difficulty',
  3: 'Correct with some hesitation',
  4: 'Perfect recall',
  5: 'Too easy - I knew it instantly',
};

/**
 * Convert quality to boolean for basic correct/incorrect tracking
 */
export function qualityToIsCorrect(quality: SM2Quality): boolean {
  return quality >= 3;
}
