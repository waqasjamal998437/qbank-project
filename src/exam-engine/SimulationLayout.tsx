'use client';

import React, { useEffect } from 'react';
import { useExamStore } from './useExamStore';
import QuestionPanel from './QuestionPanel';
import OptionsPanel from './OptionsPanel';
import NavigatorGrid from './NavigatorGrid';
import LabValuesModal from './LabValuesModal';
import ResultsDashboard from './ResultsDashboard';
import { sampleQuestions } from './sampleQuestions';

export default function SimulationLayout() {
  const {
    session,
    mode,
    showNavigator,
    showLabValues,
    timerHidden,
    initializeSession,
    endSession,
    toggleNavigator,
    toggleLabValues,
    toggleTimerVisibility,
  } = useExamStore();

  // Initialize session on mount if not already initialized
  useEffect(() => {
    if (!session) {
      initializeSession(sampleQuestions, 'timed', 60 * 60); // 60 minutes
    }
  }, [session, initializeSession]);

  // Timer effect
  useEffect(() => {
    if (session?.isEnded) return;
    
    const timer = setInterval(() => {
      useExamStore.getState().tick();
    }, 1000);
    
    return () => clearInterval(timer);
  }, [session?.isEnded]);

  // Auto-enter review mode when time expires
  useEffect(() => {
    if (session?.isEnded && mode !== 'review') {
      useExamStore.setState({ mode: 'review' });
    }
  }, [session?.isEnded, mode]);

  // Show results dashboard in review mode
  if (session?.isEnded || mode === 'review') {
    return <ResultsDashboard />;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F3F4F6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading exam session...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[session.currentIndex];
  const currentResponse = session.responses[currentQuestion?.id];

  // Format time remaining
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6]">
      {/* ========================================================================= */}
      {/* Top Navigation Bar - NBME Style */}
      {/* ========================================================================= */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#E5E7EB] shadow-sm shrink-0">
        {/* Left: Block Name & Progress */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#374151]">
              Block {session.id.slice(0, 4).toUpperCase()}
            </span>
            <span className="text-xs text-[#6B7280] px-2 py-1 bg-[#F3F4F6] rounded-full">
              Step 1 Style
            </span>
          </div>
          
          <div className="h-6 w-px bg-[#E5E7EB]" />
          
          <span className="text-sm text-[#374151]">
            Question {session.currentIndex + 1} of {session.questions.length}
          </span>
        </div>

        {/* Center: Timer */}
        <div className="flex items-center gap-2">
          {!timerHidden ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`text-lg font-mono font-medium ${
                session.timeRemaining < 300 ? 'text-[#DC2626]' : 
                session.timeRemaining < 900 ? 'text-[#D97706]' : 'text-[#374151]'
              }`}>
                {formatTime(session.timeRemaining)}
              </span>
            </div>
          ) : (
            <span className="text-sm text-[#6B7280] italic">Timer hidden</span>
          )}
          
          <button
            onClick={toggleTimerVisibility}
            className="p-2 text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-colors"
            title={timerHidden ? 'Show timer' : 'Hide timer'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {timerHidden ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              )}
            </svg>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLabValues}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#374151] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Lab Values
          </button>
          
          <button
            onClick={toggleNavigator}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              showNavigator 
                ? 'bg-[#6366F1] text-white' 
                : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F3F4F6]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Navigator
          </button>
          
          <button
            onClick={endSession}
            className="px-4 py-2 text-sm font-medium text-white bg-[#DC2626] rounded-lg hover:bg-[#B91C1C] transition-colors"
          >
            End Block
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* Main Content - Split View */}
      {/* ========================================================================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane: Clinical Vignette (Stem) */}
        <div className="w-1/2 p-6 overflow-y-auto bg-white border-r border-[#E5E7EB]">
          <QuestionPanel 
            stem={currentQuestion?.stem || ''}
            questionId={currentQuestion?.id}
          />
        </div>

        {/* Right Pane: Options List */}
        <div className="w-1/2 p-6 overflow-y-auto bg-[#F9FAFB]">
          <OptionsPanel
            options={currentQuestion?.options || []}
            selected={currentResponse?.selectedIndex ?? null}
            struck={currentResponse?.isStruck || new Set()}
            questionId={currentQuestion?.id}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Bottom Navigation Bar */}
      {/* ========================================================================= */}
      <footer className="flex items-center justify-between px-6 py-3 bg-white border-t border-[#E5E7EB] shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={useExamStore.getState().prevQuestion}
            disabled={session.currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#374151] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <button
            onClick={useExamStore.getState().nextQuestion}
            disabled={session.currentIndex === session.questions.length - 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#374151] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => useExamStore.getState().toggleFlag(currentQuestion?.id || '')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentResponse?.isFlagged
                ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]'
                : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F3F4F6]'
            }`}
          >
            <svg className="w-4 h-4" fill={currentResponse?.isFlagged ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {currentResponse?.isFlagged ? 'Flagged' : 'Flag'}
          </button>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* Modals */}
      {/* ========================================================================= */}
      {showNavigator && <NavigatorGrid />}
      {showLabValues && <LabValuesModal />}
    </div>
  );
}
