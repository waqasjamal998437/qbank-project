'use client';

import React, { useState, useCallback } from 'react';
import { useExamStore } from './useExamStore';

interface OptionsPanelProps {
  options: string[];
  selected: number | undefined | null;
  struck: Set<number>;
  questionId?: string;
}

export default function OptionsPanel({ options, selected, struck, questionId }: OptionsPanelProps) {
  const { mode, session } = useExamStore();
  const [localStruck, setLocalStruck] = useState<Set<number>>(() => {
    if (struck instanceof Set) {
      return new Set(Array.from(struck).filter((item): item is number => typeof item === 'number'));
    }
    return new Set<number>();
  });

  // Handle right-click to strike through
  const handleRightClick = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault();
    
    setLocalStruck((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });

    // Also update store
    if (questionId) {
      useExamStore.getState().toggleStrike(questionId, index);
    }
  }, [questionId]);

  // Handle left-click to select
  const handleClick = useCallback((index: number) => {
    if (questionId) {
      useExamStore.getState().selectAnswer(questionId, index);
    }
  }, [questionId]);

  // Check if we should show the answer (tutor mode)
  const showAnswer = mode === 'tutor' && selected !== null && selected !== undefined;
  const currentQuestion = session?.questions.find(q => q.id === questionId);
  const isCorrectAnswer = showAnswer && currentQuestion && selected === currentQuestion.correctIndex;

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const optionLetter = String.fromCharCode(65 + index);
        const isSelected = selected === index;
        const isStruck = localStruck.has(index);
        const isCorrect = currentQuestion && index === currentQuestion.correctIndex;
        
        // Determine styling based on mode and state
        let optionClass = 'bg-white border-slate-200 hover:bg-slate-50';
        
        if (showAnswer) {
          if (isCorrect) {
            optionClass = 'bg-emerald-50 border-emerald-500 border-2';
          } else if (isSelected && !isCorrect) {
            optionClass = 'bg-red-50 border-red-500 border-2';
          }
        } else {
          if (isSelected) {
            optionClass = 'bg-blue-50 border-blue-500 border-2';
          }
        }

        return (
          <div
            key={index}
            className={`relative p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 ${optionClass} ${
              isStruck ? 'opacity-50 line-through' : ''
            }`}
            onClick={() => handleClick(index)}
            onContextMenu={(e) => handleRightClick(index, e)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-500 bg-white">
                {optionLetter}
              </span>
              <span className="flex-1 text-slate-800">{option}</span>
              {isSelected && (
                <span className="text-sm font-medium text-blue-600">
                  {showAnswer ? (isCorrect ? '✓ Correct' : '✗ Incorrect') : 'Selected'}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
