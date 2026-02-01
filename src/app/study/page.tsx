"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Layout } from "../../components/Layout";
import { QuestionCard } from "../../components/QuestionCard";
import { mockQuestions } from "../../data/mockQuestions";
import {
  BookOpen,
  Clock,
  Target,
  Filter,
  ChevronRight,
  Play,
  Settings,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

interface StudyConfig {
  questionCount: number;
  category: string | null;
  subcategories: string[];
  timeLimit: number | null;
  shuffle: boolean;
}

const CATEGORIES = [
  { name: "Cardiology", icon: "❤️", color: "bg-red-50 text-red-600" },
  { name: "Neurology", icon: "🧠", color: "bg-purple-50 text-purple-600" },
  { name: "Pediatrics", icon: "👶", color: "bg-blue-50 text-blue-600" },
  { name: "Ethics", icon: "⚖️", color: "bg-amber-50 text-amber-600" },
  { name: "Surgery", icon: "🔪", color: "bg-slate-50 text-slate-600" },
  { name: "Pharmacology", icon: "💊", color: "bg-emerald-50 text-emerald-600" },
];

export default function StudyPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showConfig, setShowConfig] = useState(true);
  const [config, setConfig] = useState<StudyConfig>({
    questionCount: 10,
    category: null,
    subcategories: [],
    timeLimit: null,
    shuffle: true,
  });

  const filteredQuestions = useMemo(() => {
    let questions = [...mockQuestions];

    if (config.category) {
      questions = questions.filter((q) => q.category === config.category);
    }

    if (config.shuffle) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    return questions.slice(0, config.questionCount);
  }, [config]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const progress = filteredQuestions.length > 0 ? ((currentQuestionIndex + 1) / filteredQuestions.length) * 100 : 0;

  // Stats for the header
  const stats = useMemo(() => {
    return {
      total: mockQuestions.length,
      answered: currentQuestionIndex + 1,
      correct: 0,
    };
  }, [currentQuestionIndex]);

  // Skeleton for loading
  function SkeletonQuestion() {
    return (
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
          <div className="space-y-3 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Configuration Panel
  function ConfigPanel() {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Study Session</h2>
          <p className="text-slate-500">Configure your practice session</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">Category</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setConfig({ ...config, category: null })}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                config.category === null
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setConfig({ ...config, category: cat.name })}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  config.category === cat.name
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Number of Questions: {config.questionCount}
          </label>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={config.questionCount}
            onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>5</span>
            <span>50</span>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.shuffle}
              onChange={(e) => setConfig({ ...config, shuffle: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">Shuffle questions</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.timeLimit !== null}
              onChange={(e) => setConfig({ ...config, timeLimit: e.target.checked ? 60 : null })}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">Enable timer (1 min/question)</span>
          </label>
        </div>

        <button
          onClick={() => setShowConfig(false)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Play className="w-5 h-5" />
          Start Session
        </button>
      </motion.div>
    );
  }

  // Results summary
  function ResultsSummary() {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 max-w-2xl mx-auto text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Session Complete!</h2>
        <p className="text-slate-500 mb-6">Great job finishing your study session.</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-slate-800">{filteredQuestions.length}</p>
            <p className="text-sm text-slate-500">Questions</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-blue-600">75%</p>
            <p className="text-sm text-slate-500">Accuracy</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-slate-800">15m</p>
            <p className="text-sm text-slate-500">Time Taken</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setCurrentQuestionIndex(0);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Retry Session
          </button>
          <button
            onClick={() => {
              setShowConfig(true);
              setCurrentQuestionIndex(0);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            <Settings className="w-5 h-5" />
            New Session
          </button>
        </div>
      </motion.div>
    );
  }

  const isSessionComplete = currentQuestionIndex === filteredQuestions.length - 1;

  return (
    <Layout>
      <div className="p-6 lg:p-8 bg-[#F8FAFC] min-h-full">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Study Mode</h1>
              <p className="text-slate-500 mt-1">Practice questions at your own pace</p>
            </div>
            {!showConfig && !isSessionComplete && (
              <button
                onClick={() => setShowConfig(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Settings</span>
              </button>
            )}
          </motion.div>

          {!showConfig && !isSessionComplete && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">
                    Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                  </span>
                  <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>

              {currentQuestion ? (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <QuestionCard
                    question={currentQuestion}
                    onNext={handleNext}
                    currentIndex={currentQuestionIndex}
                    totalQuestions={filteredQuestions.length}
                  />
                </motion.div>
              ) : (
                <SkeletonQuestion />
              )}
            </>
          )}

          {showConfig && <ConfigPanel />}

          {isSessionComplete && <ResultsSummary />}
        </div>
      </div>
    </Layout>
  );
}
