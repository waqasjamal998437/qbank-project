import { persist } from "zustand/middleware";
import { create } from "zustand";
import { ExamQuestion } from "./types";

interface ExamState {
  questions: ExamQuestion[];
  current: number;
  flagged: Set<number>;
  selections: Record<number, number>;
  timeLeft: number;
  startedAt: number | null;
  ended: boolean;
  reviewMode: boolean;
  next: () => void;
  prev: () => void;
  jump: (idx: number) => void;
  flag: (idx: number) => void;
  select: (idx: number, val: number) => void;
  tick: () => void;
  endBlock: () => void;
  enterReview: () => void;
  setQuestions: (questions: ExamQuestion[]) => void;
}


export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      questions: [],
      current: 0,
      flagged: new Set<number>(),
      selections: {},
      timeLeft: 60 * 60,
      startedAt: null,
      ended: false,
      reviewMode: false,
      next: () => set((s: ExamState) => ({ current: Math.min(s.current + 1, s.questions.length - 1) })),
      prev: () => set((s: ExamState) => ({ current: Math.max(s.current - 1, 0) })),
      jump: (idx: number) => set(() => ({ current: idx })),
      flag: (idx: number) => set((s: ExamState) => {
        const flagged = new Set(s.flagged);
        flagged.has(idx) ? flagged.delete(idx) : flagged.add(idx);
        return { flagged };
      }),
      select: (idx: number, val: number) => set((s: ExamState) => ({ selections: { ...s.selections, [idx]: val } })),
      tick: () => set((s: ExamState) => {
        if (s.ended || s.reviewMode) return {};
        if (s.timeLeft <= 1) return { timeLeft: 0, ended: true };
        return { timeLeft: s.timeLeft - 1 };
      }),
      endBlock: () => set(() => ({ ended: true })),
      enterReview: () => set(() => ({ reviewMode: true })),
      setQuestions: (questions: ExamQuestion[]) => set(() => ({ questions })),
    }),
    { name: "exam-sim-state" }
  )
);
