import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  ExamMode, 
  ExamQuestion, 
  QuestionResponse, 
  ExamSession,
  ExamAnalytics 
} from './types';

// ============================================================================
// Comprehensive Exam Store with Three Modes
// ============================================================================

interface ExamState {
  // Session Configuration
  session: ExamSession | null;
  mode: ExamMode;
  
  // Timer State
  timerRunning: boolean;
  timerInterval: NodeJS.Timeout | null;
  
  // UI State
  showNavigator: boolean;
  showLabValues: boolean;
  timerHidden: boolean;
  
  // Actions - Session Management
  initializeSession: (questions: ExamQuestion[], mode: ExamMode, timeLimit?: number) => void;
  endSession: () => void;
  resetSession: () => void;
  
  // Actions - Navigation
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  
  // Actions - Question Interaction
  selectAnswer: (questionId: string, optionIndex: number) => void;
  toggleFlag: (questionId: string) => void;
  toggleStrike: (questionId: string, optionIndex: number) => void;
  addHighlight: (questionId: string, range: Range) => void;
  clearHighlights: (questionId: string) => void;
  
  // Actions - Timer
  startTimer: () => void;
  pauseTimer: () => void;
  tick: () => void;
  
  // Actions - UI
  toggleNavigator: () => void;
  toggleLabValues: () => void;
  toggleTimerVisibility: () => void;
  
  // Selectors - Computed State
  getCurrentQuestion: () => ExamQuestion | null;
  getCurrentResponse: () => QuestionResponse | null;
  getAnalytics: () => ExamAnalytics;
  getNavigatorData: () => Array<{ index: number; id: string; status: string; isCorrect?: boolean }>;
  isCurrentQuestionAnswered: () => boolean;
  getProgressPercentage: () => number;
}

const DEFAULT_TIME_LIMIT = 60 * 60; // 60 minutes default

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      // Initial State
      session: null,
      mode: 'timed',
      timerRunning: false,
      timerInterval: null,
      showNavigator: false,
      showLabValues: false,
      timerHidden: false,
      
      // =========================================================================
      // Session Management
      // =========================================================================
      
      initializeSession: (questions, mode, timeLimit = DEFAULT_TIME_LIMIT) => {
        const session: ExamSession = {
          id: crypto.randomUUID(),
          mode,
          questions,
          responses: {},
          currentIndex: 0,
          startedAt: Date.now(),
          timeLimit,
          timeRemaining: timeLimit,
          isEnded: false,
        };
        
        // Initialize empty responses for all questions
        questions.forEach(q => {
          session.responses[q.id] = {
            questionId: q.id,
            selectedIndex: null,
            isFlagged: false,
            isStruck: new Set(),
            timeSpent: 0,
          };
        });
        
        set({ session, mode, timerRunning: mode === 'timed' });
        
        // Start timer if in timed mode
        if (mode === 'timed') {
          get().startTimer();
        }
      },
      
      endSession: () => {
        const { session, timerInterval } = get();
        if (session) {
          // Clear timer
          if (timerInterval) {
            clearInterval(timerInterval);
          }
          
          set({
            session: {
              ...session,
              endedAt: Date.now(),
              isEnded: true,
              timeRemaining: 0,
            },
            timerRunning: false,
            timerInterval: null,
            mode: 'review',
          });
        }
      },
      
      resetSession: () => {
        const { timerInterval } = get();
        if (timerInterval) {
          clearInterval(timerInterval);
        }
        
        set({
          session: null,
          mode: 'timed',
          timerRunning: false,
          timerInterval: null,
          showNavigator: false,
          showLabValues: false,
        });
      },
      
      // =========================================================================
      // Navigation
      // =========================================================================
      
      goToQuestion: (index) => {
        const { session } = get();
        if (session && index >= 0 && index < session.questions.length) {
          set({
            session: {
              ...session,
              currentIndex: index,
            },
          });
        }
      },
      
      nextQuestion: () => {
        const { session, goToQuestion } = get();
        if (session && session.currentIndex < session.questions.length - 1) {
          goToQuestion(session.currentIndex + 1);
        }
      },
      
      prevQuestion: () => {
        const { session, goToQuestion } = get();
        if (session && session.currentIndex > 0) {
          goToQuestion(session.currentIndex - 1);
        }
      },
      
      // =========================================================================
      // Question Interaction
      // =========================================================================
      
      selectAnswer: (questionId, optionIndex) => {
        const { session, mode } = get();
        if (!session) return;
        
        const response = session.responses[questionId];
        if (response) {
          const newResponses = {
            ...session.responses,
            [questionId]: {
              ...response,
              selectedIndex: optionIndex,
            },
          };
          
          set({
            session: {
              ...session,
              responses: newResponses,
            },
          });
          
          // In tutor mode, reveal answer immediately
          if (mode === 'tutor') {
            // Handle tutor mode feedback logic here
          }
        }
      },
      
      toggleFlag: (questionId) => {
        const { session } = get();
        if (!session) return;
        
        const response = session.responses[questionId];
        if (response) {
          const newResponses = {
            ...session.responses,
            [questionId]: {
              ...response,
              isFlagged: !response.isFlagged,
            },
          };
          
          set({
            session: {
              ...session,
              responses: newResponses,
            },
          });
        }
      },
      
      toggleStrike: (questionId, optionIndex) => {
        const { session } = get();
        if (!session) return;
        
        const response = session.responses[questionId];
        if (response) {
          const newStruck = new Set(response.isStruck);
          if (newStruck.has(optionIndex)) {
            newStruck.delete(optionIndex);
          } else {
            newStruck.add(optionIndex);
          }
          
          const newResponses = {
            ...session.responses,
            [questionId]: {
              ...response,
              isStruck: newStruck,
            },
          };
          
          set({
            session: {
              ...session,
              responses: newResponses,
            },
          });
        }
      },
      
      addHighlight: (questionId, range) => {
        const { session } = get();
        if (!session) return;
        
        const response = session.responses[questionId];
        if (response) {
          // Convert range to serializable format
          const highlightData = {
            startContainer: range.startContainer.nodeValue?.substring(0, 100) || '',
            startOffset: range.startOffset,
            endOffset: range.endOffset,
            text: range.toString(),
          };
          
          const existingHighlights = response.highlightedText 
            ? JSON.parse(response.highlightedText) 
            : [];
          
          existingHighlights.push(highlightData);
          
          const newResponses = {
            ...session.responses,
            [questionId]: {
              ...response,
              highlightedText: JSON.stringify(existingHighlights),
            },
          };
          
          set({
            session: {
              ...session,
              responses: newResponses,
            },
          });
        }
      },
      
      clearHighlights: (questionId) => {
        const { session } = get();
        if (!session) return;
        
        const response = session.responses[questionId];
        if (response) {
          const newResponses = {
            ...session.responses,
            [questionId]: {
              ...response,
              highlightedText: undefined,
            },
          };
          
          set({
            session: {
              ...session,
              responses: newResponses,
            },
          });
        }
      },
      
      // =========================================================================
      // Timer
      // =========================================================================
      
      startTimer: () => {
        const { timerRunning, timerInterval, session, tick } = get();
        if (timerRunning || !session) return;
        
        const interval = setInterval(tick, 1000);
        set({ timerRunning: true, timerInterval: interval });
      },
      
      pauseTimer: () => {
        const { timerInterval, timerRunning } = get();
        if (!timerRunning || !timerInterval) return;
        
        clearInterval(timerInterval);
        set({ timerRunning: false, timerInterval: null });
      },
      
      tick: () => {
        const { session, timerInterval } = get();
        if (!session || session.isEnded) return;
        
        if (session.timeRemaining <= 1) {
          // Time's up - end session
          clearInterval(timerInterval!);
          set({
            session: {
              ...session,
              timeRemaining: 0,
              isEnded: true,
            },
            timerRunning: false,
            timerInterval: null,
          });
          return;
        }
        
        // Update time and track time spent on current question
        set({
          session: {
            ...session,
            timeRemaining: session.timeRemaining - 1,
            responses: {
              ...session.responses,
              [session.questions[session.currentIndex].id]: {
                ...session.responses[session.questions[session.currentIndex].id],
                timeSpent: session.responses[session.questions[session.currentIndex].id].timeSpent + 1,
              },
            },
          },
        });
      },
      
      // =========================================================================
      // UI Controls
      // =========================================================================
      
      toggleNavigator: () => set((state) => ({ showNavigator: !state.showNavigator })),
      toggleLabValues: () => set((state) => ({ showLabValues: !state.showLabValues })),
      toggleTimerVisibility: () => set((state) => ({ timerHidden: !state.timerHidden })),
      
      // =========================================================================
      // Selectors
      // =========================================================================
      
      getCurrentQuestion: () => {
        const { session } = get();
        if (!session || !session.questions[session.currentIndex]) return null;
        return session.questions[session.currentIndex];
      },
      
      getCurrentResponse: () => {
        const { session } = get();
        if (!session) return null;
        const question = session.questions[session.currentIndex];
        return session.responses[question?.id] || null;
      },
      
      getAnalytics: (): ExamAnalytics => {
        const { session } = get();
        if (!session) {
          return {
            totalQuestions: 0,
            attempted: 0,
            correct: 0,
            incorrect: 0,
            percentageCorrect: 0,
            totalTimeSpent: 0,
            averageTimePerQuestion: 0,
            subjectPerformance: [],
          };
        }
        
        let attempted = 0;
        let correct = 0;
        let totalTimeSpent = 0;
        const subjectStats: Record<string, { total: number; correct: number; time: number }> = {};
        
        session.questions.forEach((question, index) => {
          const response = session.responses[question.id];
          if (response?.selectedIndex !== null) {
            attempted++;
            if (response.selectedIndex === question.correctIndex) {
              correct++;
            }
          }
          totalTimeSpent += response?.timeSpent || 0;
          
          // Track subject performance
          if (!subjectStats[question.category]) {
            subjectStats[question.category] = { total: 0, correct: 0, time: 0 };
          }
          subjectStats[question.category].total++;
          if (response?.selectedIndex === question.correctIndex) {
            subjectStats[question.category].correct++;
          }
          subjectStats[question.category].time += response?.timeSpent || 0;
        });
        
        const subjectPerformance = Object.entries(subjectStats).map(([category, stats]) => ({
          category,
          total: stats.total,
          correct: stats.correct,
          percentage: Math.round((stats.correct / stats.total) * 100),
          timeSpent: stats.time,
        }));
        
        return {
          totalQuestions: session.questions.length,
          attempted,
          correct,
          incorrect: attempted - correct,
          percentageCorrect: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
          totalTimeSpent,
          averageTimePerQuestion: attempted > 0 ? Math.round(totalTimeSpent / attempted) : 0,
          subjectPerformance,
        };
      },
      
      getNavigatorData: () => {
        const { session } = get();
        if (!session) return [];
        
        return session.questions.map((question, index) => {
          const response = session.responses[question.id];
          let status: 'attempted' | 'unattempted' | 'flagged' = 'unattempted';
          
          if (response?.isFlagged) {
            status = 'flagged';
          } else if (response?.selectedIndex !== null) {
            status = 'attempted';
          }
          
          return {
            index,
            id: question.id,
            status,
            isCorrect: session.mode === 'review' ? response?.selectedIndex === question.correctIndex : undefined,
          };
        });
      },
      
      isCurrentQuestionAnswered: () => {
        const { session } = get();
        if (!session) return false;
        const question = session.questions[session.currentIndex];
        const response = session.responses[question?.id];
        return response?.selectedIndex !== null;
      },
      
      getProgressPercentage: () => {
        const { session } = get();
        if (!session) return 0;
        const answered = Object.values(session.responses).filter(r => r.selectedIndex !== null).length;
        return Math.round((answered / session.questions.length) * 100);
      },
    }),
    {
      name: 'exam-simulation-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
        mode: state.mode,
        timerHidden: state.timerHidden,
      }),
    }
  )
);
