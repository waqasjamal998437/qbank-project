"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Clock, BookOpen } from "lucide-react";
import { subjectCategories } from "../data/mockQuestions";

interface SubjectDetailViewProps {
  subjectName: string;
  onClose: () => void;
  onStartSession: (config: SessionConfig) => void;
}

export interface SessionConfig {
  mode: "tutor" | "timed";
  questionCount: number;
  subcategories: string[];
}

export function SubjectDetailView({ subjectName, onClose, onStartSession }: SubjectDetailViewProps) {
  const [mode, setMode] = useState<"tutor" | "timed">("tutor");
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const subcategories = subjectCategories[subjectName] || [];

  const toggleSubcategory = (subcat: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcat)
        ? prev.filter((s) => s !== subcat)
        : [...prev, subcat]
    );
  };

  const handleStart = () => {
    onStartSession({
      mode,
      questionCount,
      subcategories: selectedSubcategories.length > 0 ? selectedSubcategories : subcategories,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        />

        {/* Drawer/Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-lg shadow-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E5E7EB]"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#E5E7EB] p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-semibold text-[#374151] tracking-tight">{subjectName}</h2>
              <p className="text-sm text-[#6B7280] mt-1">Customize your study session</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#6B7280] hover:text-[#374151] rounded-lg hover:bg-[#F3F4F6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Mode Toggle */}
            <div>
              <label className="text-sm font-medium text-[#374151] mb-3 block">
                Study Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode("tutor")}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      mode === "tutor"
                        ? "border-[#6366F1] bg-[#EEF2FF]"
                        : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className={`w-5 h-5 ${mode === "tutor" ? "text-[#6366F1]" : "text-[#6B7280]"}`} />
                    <div className="text-left">
                      <div className={`font-medium ${mode === "tutor" ? "text-[#6366F1]" : "text-[#374151]"}`}>
                        Tutor Mode
                      </div>
                      <div className="text-xs text-[#6B7280] mt-0.5">
                        See explanation immediately
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setMode("timed")}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      mode === "timed"
                        ? "border-[#6366F1] bg-[#EEF2FF]"
                        : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Clock className={`w-5 h-5 ${mode === "timed" ? "text-[#6366F1]" : "text-[#6B7280]"}`} />
                    <div className="text-left">
                      <div className={`font-medium ${mode === "timed" ? "text-[#6366F1]" : "text-[#374151]"}`}>
                        Timed Mode
                      </div>
                      <div className="text-xs text-[#6B7280] mt-0.5">
                        See explanation at the end
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Question Count Slider */}
            <div>
              <label className="text-sm font-medium text-[#374151] mb-3 block">
                Number of Questions
              </label>
              <div className="flex gap-2">
                {[5, 10, 20, 40].map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`
                      flex-1 py-2.5 px-4 rounded-lg border-2 font-medium transition-all
                      ${
                        questionCount === count
                          ? "border-[#6366F1] bg-[#EEF2FF] text-[#6366F1]"
                          : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#D1D5DB]"
                      }
                    `}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-category Checklist */}
            <div>
              <label className="text-sm font-medium text-[#374151] mb-3 block">
                Sub-categories
              </label>
              <div className="space-y-2">
                {subcategories.map((subcat) => {
                  const isSelected = selectedSubcategories.includes(subcat);
                  return (
                    <label
                      key={subcat}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${
                          isSelected
                            ? "border-[#6366F1] bg-[#EEF2FF]"
                            : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSubcategory(subcat)}
                        className="w-4 h-4 text-[#6366F1] border-[#E5E7EB] rounded focus:ring-[#6366F1]"
                      />
                      <span className={`flex-1 ${isSelected ? "text-[#6366F1] font-medium" : "text-[#374151]"}`}>
                        {subcat}
                      </span>
                    </label>
                  );
                })}
              </div>
              {selectedSubcategories.length === 0 && (
                <p className="text-xs text-[#6B7280] mt-2">
                  All subcategories will be included if none are selected
                </p>
              )}
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className="w-full py-3 px-6 rounded-lg bg-[#374151] text-white font-medium flex items-center justify-center gap-2 transition-all hover:bg-[#1F2937]"
            >
              <Play className="w-5 h-5" />
              Start Session
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
