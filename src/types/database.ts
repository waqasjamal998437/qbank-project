// ============================================================================
// Database Types for Medical QBank
// ============================================================================

export interface Question {
  id: string;
  stem: string;
  explanation: string | null;
  educational_objective: string | null;
  system_tag: string | null;
  discipline_tag: string | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  peer_performance: number | null;
  created_at: string;
  updated_at: string;
  options?: Option[];
}

export interface Option {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  option_index: number;
}

export interface UserResponse {
  id: string;
  user_id: string;
  question_id: string;
  selected_option_id: string | null;
  time_spent_ms: number;
  is_correct: boolean;
  created_at: string;
}

export interface ExamSession {
  id: string;
  user_id: string;
  mode: 'timed' | 'tutor' | 'review';
  question_ids: string[];
  current_index: number;
  responses: Record<string, ExamResponseData>;
  time_remaining: number;
  started_at: string;
  last_saved_at: string;
  is_completed: boolean;
}

export interface ExamResponseData {
  selectedIndex: number | null;
  timeSpent: number;
  flagged: boolean;
}

export interface Flashcard {
  id: string;
  user_id: string | null;
  question_id: string | null;
  front: string;
  back: string;
  category: string | null;
  next_review_date: string;
  interval: number;
  ease_factor: number;
  repetitions: number;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface GetQuestionsParams {
  system?: string;
  discipline?: string;
  unused?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetQuestionsResponse {
  questions: Question[];
  total: number;
  hasMore: boolean;
}

export interface GetAnalyticsResponse {
  user_id: string;
  overall_stats: {
    total_questions: number;
    correct_count: number;
    accuracy_percentage: number;
    avg_time_ms: number;
  };
  by_system: SystemPerformance[];
  recent_activity: DailyActivity[];
}

export interface SystemPerformance {
  system_tag: string;
  total: number;
  correct: number;
  accuracy_percentage: number;
  avg_time_ms: number;
}

export interface DailyActivity {
  date: string;
  count: number;
  accuracy: number;
}

export interface SaveExamSessionRequest {
  session_id?: string;
  user_id: string;
  mode: 'timed' | 'tutor' | 'review';
  question_ids: string[];
  current_index: number;
  responses: Record<string, ExamResponseData>;
  time_remaining: number;
}

export interface SaveExamSessionResponse {
  session_id: string;
  saved_at: string;
}

export interface ReviewCardRequest {
  card_id: string;
  quality: 0 | 1 | 2 | 3 | 4 | 5; // SM2 quality rating
  user_id?: string;
}

export interface ReviewCardResponse {
  card_id: string;
  next_review_date: string;
  interval: number;
  ease_factor: number;
  repetitions: number;
}

export interface AddQuestionRequest {
  stem: string;
  explanation?: string;
  educational_objective?: string;
  system_tag: string;
  discipline_tag: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  options: {
    text: string;
    is_correct: boolean;
  }[];
}

export interface AddQuestionResponse {
  question_id: string;
  created_at: string;
}

// ============================================================================
// SM2 Algorithm Types
// ============================================================================

export type SM2Quality = 
  | 0 // Again - complete blackout, wrong answer
  | 1 // Hard - incorrect but upon seeing correct answer remembered
  | 2 // Hard - correct but with difficulty
  | 3 // Good - correct with some hesitation
  | 4 // Easy - perfect recall
  | 5 // Very Easy - perfect recall with no effort

export interface SM2Result {
  interval: number; // Days until next review
  easeFactor: number;
  repetitions: number;
}
