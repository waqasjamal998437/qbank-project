import { useExamStore } from "./ExamController";
import React, { useEffect } from "react";
import QuestionPanel from "./QuestionPanel";
import OptionsPanel from "./OptionsPanel";
import LabValuesModal from "./LabValuesModal";
import ReviewPanel from "./ReviewPanel";
import { sampleQuestions } from "./sampleQuestions";

export default function SimulationInterface() {
  const {
    questions,
    current,
    timeLeft,
    ended,
    reviewMode,
    next,
    prev,
    jump,
    flag,
    selections,
    flagged,
    endBlock,
    enterReview,
    setQuestions,
  } = useExamStore();

  // Load questions on mount
  React.useEffect(() => {
    if (!questions.length) setQuestions(sampleQuestions);
    // eslint-disable-next-line
  }, []);

  // Timer effect
  useEffect(() => {
    if (!ended && !reviewMode && timeLeft > 0) {
      const interval = setInterval(() => useExamStore.getState().tick(), 1000);
      return () => clearInterval(interval);
    }
  }, [ended, reviewMode, timeLeft]);

  // Enter review mode when block ends
  useEffect(() => {
    if (ended && !reviewMode) {
      setTimeout(() => enterReview(), 1000);
    }
  }, [ended, reviewMode, enterReview]);

  if (reviewMode) return <ReviewPanel />;

  if (!questions.length) return <div className="p-10 text-gray-500">No questions loaded.</div>;

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB]">
      {/* Minimal Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#E5E7EB] bg-white">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#374151] tracking-tight">Exam Session</span>
          <span className="text-xs text-[#6B7280] px-2 py-0.5 bg-[#F3F4F6] rounded-full">
            {current + 1} of {questions.length}
          </span>
        </div>
        {/* Subtle Timer */}
        <div className="text-sm text-[#6B7280] font-mono">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
        </div>
        <button
          className="text-sm text-[#374151] px-4 py-2 rounded-md bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors"
          onClick={endBlock}
        >
          End Session
        </button>
      </header>

      {/* Main Content - Generous Padding */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Question Panel */}
        <div className="w-1/2 p-10 overflow-y-auto bg-white">
          <QuestionPanel stem={questions[current].stem} />
        </div>
        {/* Right: Options Panel */}
        <div className="w-1/2 p-10 overflow-y-auto bg-[#F9FAFB] border-l border-[#E5E7EB]">
          <OptionsPanel
            options={questions[current].options}
            selected={selections[current]}
            onSelect={(val) => useExamStore.getState().select(current, val)}
          />
        </div>
      </div>

      {/* Minimal Navigation Grid */}
      <div className="flex items-center justify-center py-4 bg-white border-t border-[#E5E7EB] gap-1">
        {questions.map((_: unknown, idx: number) => (
          <button
            key={idx}
            className={`w-8 h-8 rounded-md text-sm font-medium transition-all duration-150
              ${idx === current 
                ? "bg-[#374151] text-white" 
                : flagged.has(idx) 
                  ? "border border-[#E5E7EB] bg-[#F9FAFB] text-[#374151]" 
                  : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6]"
              }
            `}
            onClick={() => jump(idx)}
            aria-label={`Go to question ${idx + 1}${flagged.has(idx) ? ", flagged for review" : ""}`}
            title={flagged.has(idx) ? "Flagged for review" : `Go to question ${idx + 1}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      <LabValuesModal />
    </div>
  );
}
