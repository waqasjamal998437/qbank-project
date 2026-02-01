'use client';

import React, { useState } from 'react';
import { useExamStore } from './useExamStore';

type ViewMode = 'summary' | 'detailed' | 'subjects';

export default function ResultsDashboard() {
  const { session, resetSession } = useExamStore();
  const [viewMode, setViewMode] = useState<ViewMode>('summary');

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F3F4F6]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">No Session Data</h2>
          <p className="text-slate-500 mb-4">No exam session to display.</p>
          <button
            onClick={() => window.location.href = '/exam-sim'}
            className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition-colors"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  const analytics = useExamStore.getState().getAnalytics();
  
  // Calculate time breakdown
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Get percentile comparison
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 80) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    if (percentage >= 60) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 40) return { label: 'Average', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { label: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const performance = getPerformanceLevel(analytics.percentageCorrect);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Exam Results</h1>
              <p className="text-sm text-slate-500 mt-1">
                Completed on {new Date(session.endedAt || Date.now()).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetSession}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#4F46E5] transition-colors"
              >
                Retake Exam
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* View Mode Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1">
            {(['summary', 'detailed', 'subjects'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                  viewMode === mode
                    ? 'border-[#6366F1] text-[#6366F1]'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {viewMode === 'summary' && (
          <div className="space-y-6">
            {/* Main Score Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-start gap-8">
                <div className="text-center">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold ${performance.bg} ${performance.color}`}>
                    {analytics.percentageCorrect}%
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-500">Overall Score</p>
                </div>
                
                <div className="flex-1 grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-3xl font-bold text-emerald-600">{analytics.correct}</p>
                    <p className="text-sm text-slate-500">Correct</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-3xl font-bold text-red-600">{analytics.incorrect}</p>
                    <p className="text-sm text-slate-500">Incorrect</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-3xl font-bold text-slate-600">{analytics.totalQuestions - analytics.attempted}</p>
                    <p className="text-sm text-slate-500">Unanswered</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Performance Level</span>
                  <span className={`font-semibold ${performance.color}`}>{performance.label}</span>
                </div>
              </div>
            </div>

            {/* Timing Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Timing Analysis</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500">Total Time Spent</p>
                  <p className="text-2xl font-bold text-slate-800">{formatTime(analytics.totalTimeSpent)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Average per Question</p>
                  <p className="text-2xl font-bold text-slate-800">{formatTime(analytics.averageTimePerQuestion)}</p>
                </div>
              </div>
            </div>

            {/* Subject Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Subject Performance</h3>
              <div className="space-y-4">
                {analytics.subjectPerformance.map((subject) => (
                  <div key={subject.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{subject.category}</span>
                      <span className="text-sm text-slate-500">{subject.correct}/{subject.total} ({subject.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#6366F1] rounded-full transition-all duration-500"
                        style={{ width: `${subject.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'detailed' && (
          <div className="space-y-4">
            {session.questions.map((question, index) => {
              const response = session.responses[question.id];
              const isCorrect = response?.selectedIndex === question.correctIndex;
              
              return (
                <div 
                  key={question.id}
                  className={`bg-white rounded-xl border p-6 ${
                    isCorrect ? 'border-emerald-200' : 'border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                      <span className="text-sm text-slate-500">Question {index + 1}</span>
                      {question.peerPerformance && (
                        <span className="text-xs text-slate-400">
                          Peer performance: {question.peerPerformance}%
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-slate-500">
                      Time: {formatTime(response?.timeSpent || 0)}
                    </span>
                  </div>

                  {/* Question Stem */}
                  <div 
                    className="prose prose-slate max-w-none mb-4 text-slate-700"
                    dangerouslySetInnerHTML={{ __html: question.stem }}
                  />

                  {/* Answer Options */}
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optIndex) => {
                      let optionClass = 'border-slate-200';
                      if (optIndex === question.correctIndex) {
                        optionClass = 'border-emerald-500 bg-emerald-50';
                      } else if (optIndex === response?.selectedIndex && !isCorrect) {
                        optionClass = 'border-red-500 bg-red-50';
                      }
                      
                      return (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border ${optionClass}`}
                        >
                          <span className="font-medium text-slate-700">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>{' '}
                          <span className={optIndex === question.correctIndex ? 'text-emerald-700 font-medium' : 'text-slate-700'}>
                            {option}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Explanation</h4>
                    <p className="text-sm text-slate-600">{question.explanation}</p>
                  </div>

                  {/* Educational Objective */}
                  {question.educationalObjective && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-700 mb-1">Educational Objective</h4>
                      <p className="text-sm text-blue-600">{question.educationalObjective}</p>
                    </div>
                  )}

                  {/* Topic Tags */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                      {question.category}
                    </span>
                    {question.topicTags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'subjects' && (
          <div className="space-y-6">
            {analytics.subjectPerformance.map((subject) => (
              <div key={subject.category} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">{subject.category}</h3>
                  <span className={`text-sm font-medium ${
                    subject.percentage >= 70 ? 'text-emerald-600' :
                    subject.percentage >= 50 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {subject.percentage}%
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-800">{subject.total}</p>
                    <p className="text-xs text-slate-500">Questions</p>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">{subject.correct}</p>
                    <p className="text-xs text-slate-500">Correct</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{subject.total - subject.correct}</p>
                    <p className="text-xs text-slate-500">Incorrect</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-800">{formatTime(subject.timeSpent)}</p>
                    <p className="text-xs text-slate-500">Time Spent</p>
                  </div>
                </div>

                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      subject.percentage >= 70 ? 'bg-emerald-500' :
                      subject.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
