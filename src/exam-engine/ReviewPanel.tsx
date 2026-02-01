import { useExamStore } from "./ExamController";
import React from "react";

export default function ReviewPanel() {
  const { questions, selections } = useExamStore();

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB]">
      {/* Minimal Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#E5E7EB] bg-white">
        <div className="font-medium text-[#374151] tracking-tight">Review Session</div>
        <div className="text-sm text-[#6B7280]">Exam Complete</div>
        <div />
      </header>

      {/* Review Content */}
      <div className="flex-1 overflow-y-auto p-10">
        <h2 className="text-2xl font-semibold text-[#374151] tracking-tight mb-8">Exam Review</h2>
        <div className="space-y-6 max-w-4xl">
          {questions.map((q, idx) => {
            const userAnswer = selections[idx];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div 
                key={q.id} 
                className="bg-white rounded-xl shadow-sm p-8 border border-[#E5E7EB]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#6B7280]">Question {idx + 1}</span>
                  <span 
                    className={`text-sm font-medium ${
                      isCorrect ? "text-[#059669]" : "#DC2626"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>
                
                {/* Question Stem */}
                <div 
                  className="prose prose-slate max-w-none mb-6 text-[#374151]"
                  dangerouslySetInnerHTML={{ __html: q.stem }}
                />

                {/* Answers */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-medium text-[#6B7280] w-28 shrink-0">Your Answer:</span>
                    <span className={isCorrect ? "text-[#059669]" : "text-[#DC2626]"}>
                      {typeof userAnswer === "number" ? q.options[userAnswer] : <em className="text-[#6B7280]">None</em>}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-medium text-[#6B7280] w-28 shrink-0">Correct Answer:</span>
                    <span className="text-[#6366F1]">{q.options[q.correctIndex]}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-medium text-[#6B7280] w-28 shrink-0">Explanation:</span>
                    <span className="text-[#374151]">{q.explanation}</span>
                  </div>
                </div>

                {/* Educational Objective */}
                {q.educationalObjective && (
                  <div className="mt-4 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    <span className="text-sm font-medium text-[#6B7280] block mb-1">Educational Objective</span>
                    <span className="text-[#374151]">{q.educationalObjective}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
