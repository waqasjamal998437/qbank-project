'use client';

import React from 'react';
import { useExamStore } from './useExamStore';

interface NavigatorItem {
  index: number;
  id: string;
  status: 'attempted' | 'unattempted' | 'flagged';
  isCorrect?: boolean;
}

export default function NavigatorGrid() {
  const { session, showNavigator, toggleNavigator, goToQuestion } = useExamStore();

  if (!session || !showNavigator) return null;

  const navigatorData = useExamStore.getState().getNavigatorData() as NavigatorItem[];

  const getQuestionStatus = (item: NavigatorItem) => {
    if (item.status === 'flagged') return 'bg-amber-100 border-amber-300 text-amber-800';
    if (item.status === 'attempted') return 'bg-slate-200 border-slate-400 text-slate-800';
    return 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50';
  };

  const getQuestionIcon = (item: NavigatorItem) => {
    if (item.status === 'flagged') {
      return (
        <svg className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z" clipRule="evenodd" />
        </svg>
      );
    }
    if (item.status === 'attempted') {
      return (
        <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  // Group questions into rows of 10
  const rows: NavigatorItem[][] = [];
  navigatorData.forEach((item, index) => {
    const rowIndex = Math.floor(index / 10);
    if (!rows[rowIndex]) rows[rowIndex] = [];
    rows[rowIndex].push(item);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20" 
        onClick={toggleNavigator}
      />
      
      {/* Navigator Panel */}
      <div className="relative w-96 bg-white h-full shadow-xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Question Navigator</h2>
            <p className="text-sm text-slate-500">
              {navigatorData.filter(i => i.status === 'attempted').length} of {navigatorData.length} answered
            </p>
          </div>
          <button
            onClick={toggleNavigator}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-white border border-slate-200 rounded" />
            <span className="text-xs text-slate-600">Unanswered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-slate-200 border border-slate-400 rounded flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-slate-600">Answered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-slate-600">Flagged</span>
          </div>
        </div>

        {/* Question Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="mb-4">
              <div className="text-xs font-medium text-slate-400 mb-2">
                Questions {rowIndex * 10 + 1} - {Math.min((rowIndex + 1) * 10, navigatorData.length)}
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {row.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      goToQuestion(item.index);
                      toggleNavigator();
                    }}
                    className={`relative w-10 h-10 rounded-lg border text-sm font-medium transition-all duration-150 ${getQuestionStatus(item)}`}
                    title={`Question ${item.index + 1}${item.status !== 'unattempted' ? ' - Answered' : ''}`}
                  >
                    {item.index + 1}
                    {getQuestionIcon(item) && (
                      <span className="absolute -top-1 -right-1">
                        {getQuestionIcon(item)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={toggleNavigator}
            className="w-full py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close Navigator
          </button>
        </div>
      </div>
    </div>
  );
}
