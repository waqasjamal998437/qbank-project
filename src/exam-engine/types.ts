// ============================================================================
// High-Fidelity Medical Exam Simulation Engine - Types
// ============================================================================

export type ExamMode = 'timed' | 'tutor' | 'review';

export interface LabValue {
  id: string;
  name: string;
  value: string;
  unit: string;
  category: LabCategory;
  notes?: string;
}

export type LabCategory = 
  | 'hematology'
  | 'chemistry'
  | 'urinalysis'
  | 'coagulation'
  | 'cardiac'
  | 'endocrine'
  | 'other';

export interface ExamQuestion {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  educationalObjective: string;
  topicTags: string[];
  category: string;
  subcategory?: string;
  peerPerformance?: number; // Percentage of test-takers who got this right
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuestionResponse {
  questionId: string;
  selectedIndex: number | null;
  isFlagged: boolean;
  isStruck: Set<number>;
  timeSpent: number; // seconds
  highlightedText?: string; // JSON string of highlights
}

export interface ExamSession {
  id: string;
  mode: ExamMode;
  questions: ExamQuestion[];
  responses: Record<string, QuestionResponse>;
  currentIndex: number;
  startedAt: number;
  endedAt?: number;
  timeLimit: number; // seconds
  timeRemaining: number;
  isEnded: boolean;
}

export interface NavigatorQuestion {
  id: string;
  index: number;
  status: 'attempted' | 'unattempted' | 'flagged';
  isCorrect?: boolean;
}

export interface SubjectPerformance {
  category: string;
  total: number;
  correct: number;
  percentage: number;
  timeSpent: number;
}

export interface ExamAnalytics {
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  percentageCorrect: number;
  totalTimeSpent: number;
  averageTimePerQuestion: number;
  subjectPerformance: SubjectPerformance[];
  questionsByDifficulty?: Record<string, number>;
  peerComparison?: number; // How user compares to peers (percentage)
}

export interface LabCategoryGroup {
  name: LabCategory;
  displayName: string;
  icon: string;
  values: LabValue[];
}
