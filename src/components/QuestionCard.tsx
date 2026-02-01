"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { Question } from "../types/question";

interface QuestionCardProps {
  question: Question;
  onNext: () => void;
  currentIndex: number;
  totalQuestions: number;
}

type ConfidenceLevel = "not-sure" | "somewhat-sure" | "highly-confident" | null;

export function QuestionCard({ question, onNext, currentIndex, totalQuestions }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confidence, setConfidence] = useState<ConfidenceLevel>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setIsSubmitted(true);
    }
  };

  const handleNext = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedOption(null);
      setIsSubmitted(false);
      setConfidence(null);
      setIsAnimating(false);
      onNext();
    }, 300);
  }, [onNext]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isSubmitted || (isSubmitted && confidence === null)) {
        if (e.key >= "1" && e.key <= "4" && !isSubmitted) {
          const index = parseInt(e.key) - 1;
          if (index < question.options.length) {
            setSelectedOption(index);
          }
        }
        if (e.key === "Enter") {
          if (!isSubmitted && selectedOption !== null) {
            handleSubmit();
          } else if (isSubmitted && confidence !== null) {
            handleNext();
          }
        }
      } else if (isSubmitted && confidence === null) {
        if (e.key === "1") setConfidence("not-sure");
        if (e.key === "2") setConfidence("somewhat-sure");
        if (e.key === "3") setConfidence("highly-confident");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isSubmitted, selectedOption, confidence, question.options.length, handleNext]);

  const handleOptionClick = (index: number) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  useEffect(() => {
    if (isSubmitted && confidence !== null && selectedOption !== null) {
      const isCorrect = selectedOption === question.correctAnswer;
      
      fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.id,
          isCorrect,
          confidence,
        }),
      }).catch((error) => {
        console.error("Failed to save progress:", error);
      });
    }
  }, [isSubmitted, confidence, selectedOption, question.id, question.correctAnswer]);

  const isCorrect = selectedOption === question.correctAnswer;
  const showExplanation = isSubmitted && confidence !== null;

  return (
    <div className={`max-w-3xl mx-auto ${isAnimating ? "fade-out" : "fade-in"}`}>
      {/* Progress Pill */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
          <span className="text-sm font-medium text-slate-600">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100 relative">
        {/* Bookmark Toggle */}
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Bookmark question"
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 fill-blue-500 text-blue-500" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>

        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {question.category}
          </span>
        </div>

        {/* Question Text */}
        <div className="mb-8 pr-12">
          <h2 className="text-xl font-semibold text-slate-800 leading-relaxed">
            {question.text}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrectOption = index === question.correctAnswer;
            const showResult = isSubmitted && confidence !== null && (isSelected || isCorrectOption);

            let buttonClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 ";
            
            if (!isSubmitted) {
              buttonClass += isSelected
                ? "bg-blue-50 border-blue-300 border-2 text-slate-800"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
            } else if (showResult) {
              if (isCorrectOption) {
                buttonClass += "bg-emerald-50 border-emerald-300 text-slate-800";
              } else if (isSelected && !isCorrect) {
                buttonClass += "bg-red-50 border-red-300 text-slate-800";
              } else {
                buttonClass += "bg-slate-50 border-slate-200 text-slate-500";
              }
            } else {
              buttonClass += "bg-slate-50 border-slate-200 text-slate-500";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isSubmitted}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-sm font-medium text-slate-500 bg-white">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 text-base leading-relaxed">{option}</span>
                  </div>
                  {showResult && (
                    <div className="icon-zoom-in">
                      {isCorrectOption ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              selectedOption !== null
                ? "bg-blue-600 text-white cursor-pointer shadow-md hover:bg-blue-700"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            Submit Answer <span className="text-xs opacity-70">(Enter)</span>
          </button>
        )}

        {/* Confidence Rating */}
        {isSubmitted && confidence === null && (
          <div className="confidence-rating mt-6 pt-6 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-700 mb-4">
              How confident were you in your answer?
            </p>
            <div className="flex gap-3">
              {[
                { key: "not-sure", label: "Not Sure", shortcut: "1" },
                { key: "somewhat-sure", label: "Somewhat Sure", shortcut: "2" },
                { key: "highly-confident", label: "Highly Confident", shortcut: "3" },
              ].map(({ key, label, shortcut }) => (
                <button
                  key={key}
                  onClick={() => setConfidence(key as ConfidenceLevel)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-sm font-medium text-slate-700 transition-all hover:scale-[1.05] active:scale-[0.95]"
                >
                  {label} <span className="text-xs opacity-60">({shortcut})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className="explanation-box mt-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isCorrect ? "bg-emerald-100" : "bg-red-100"
                }`}>
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-base font-semibold mb-2 ${
                    isCorrect ? "text-emerald-700" : "text-red-700"
                  }`}>
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Button */}
        {isSubmitted && confidence !== null && (
          <button
            onClick={handleNext}
            className="next-button w-full mt-6 py-3 px-6 rounded-xl bg-blue-600 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] hover:bg-blue-700"
          >
            Next Question <span className="text-xs opacity-70">(Enter)</span>
          </button>
        )}
      </div>
    </div>
  );
}
