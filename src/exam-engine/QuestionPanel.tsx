'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { useExamStore } from './useExamStore';

interface QuestionPanelProps {
  stem: string;
  questionId?: string;
}

export default function QuestionPanel({ stem, questionId }: QuestionPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { session, mode } = useExamStore();
  
  // Handle text selection and highlighting
  const handleMouseUp = useCallback(() => {
    if (!questionId || !session) return;
    
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.toString().trim().length === 0) return;
    
    // In timed mode, we still allow highlighting but don't show immediate feedback
    // In tutor mode, we could show educational content
    
    try {
      const range = selection.getRangeAt(0);
      
      // Check if selection is within our container
      if (!containerRef.current?.contains(range.commonAncestorContainer)) return;
      
      // Create highlight mark
      const mark = document.createElement('mark');
      mark.className = 'bg-yellow-200 cursor-pointer';
      mark.title = 'Click to remove highlight';
      
      // Wrap selection in mark
      range.surroundContents(mark);
      
      // Clear selection
      selection.removeAllRanges();
      
      // Store highlight data
      useExamStore.getState().addHighlight(questionId, range);
      
      // Add click handler to remove highlight
      mark.addEventListener('click', () => {
        const parent = mark.parentNode;
        if (parent) {
          const text = document.createTextNode(mark.textContent || '');
          parent.replaceChild(text, mark);
          parent.normalize();
        }
      });
    } catch (e) {
      // Selection might span multiple elements, ignore
      console.log('Cannot highlight across different elements');
    }
  }, [questionId, session]);

  // Prevent text selection in tutor mode after answering
  useEffect(() => {
    if (mode === 'tutor' && session) {
      const response = session.responses[questionId || ''];
      if (response?.selectedIndex !== null) {
        // User has answered, could disable further highlighting
      }
    }
  }, [mode, session, questionId]);

  return (
    <div className="relative">
      {/* Highlighter Tool Hint */}
      <div className="absolute -top-8 left-0 flex items-center gap-2 text-xs text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        <span>Select text to highlight</span>
      </div>

      {/* Question Stem */}
      <div
        ref={containerRef}
        className="prose prose-slate max-w-none text-[#374151]"
        onMouseUp={handleMouseUp}
        dangerouslySetInnerHTML={{ __html: stem }}
        style={{
          fontSize: '1.125rem',
          lineHeight: 1.8,
        }}
      />

      {/* Instructions Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          💡 Tip: Select any text in the vignette to highlight important information. 
          Right-click answer options to cross them out.
        </p>
      </div>
    </div>
  );
}
