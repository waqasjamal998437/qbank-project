"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "../../components/Layout";
import { FlipCard } from "../../components/FlipCard";
import { subjectCategories } from "../../data/mockQuestions";
import {
  RotateCcw,
  Clock,
  CheckCircle2,
  Sparkles,
  Brain,
  Layers,
  Play,
  X,
  ChevronRight,
  Target,
  TrendingUp,
} from "lucide-react";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  interval: number;
  easeFactor: number;
  status: "new" | "learning" | "review";
  lastReviewed?: Date;
  nextReview?: Date;
  repetitions: number;
}

const DUMMY_DECK: Flashcard[] = [
  {
    id: "card-1",
    front: "What is the most common cause of atrial fibrillation?",
    back: "Hypertension and age-related changes in the heart's electrical system. Other causes include heart disease, hyperthyroidism, and alcohol use.",
    category: "Cardiology",
    interval: 0,
    easeFactor: 2.5,
    status: "new",
    repetitions: 0,
  },
  {
    id: "card-2",
    front: "Define systolic heart failure.",
    back: "Systolic heart failure occurs when the heart muscle cannot contract effectively, leading to reduced ejection fraction (<40%) and impaired pumping of blood.",
    category: "Cardiology",
    interval: 4,
    easeFactor: 2.5,
    status: "review",
    repetitions: 2,
    lastReviewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    nextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "card-3",
    front: "What are the classic signs of acute MI?",
    back: "Chest pain (crushing, pressure-like), radiation to left arm/jaw, diaphoresis, nausea, and ST elevation on ECG.",
    category: "Cardiology",
    interval: 1,
    easeFactor: 2.5,
    status: "learning",
    repetitions: 1,
    lastReviewed: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "neuro-1",
    front: "What is the difference between ischemic and hemorrhagic stroke?",
    back: "Ischemic stroke (87%) is caused by blocked blood vessels (thrombus/embolus). Hemorrhagic stroke (13%) is caused by bleeding into brain tissue (intracerebral) or subarachnoid space.",
    category: "Neurology",
    interval: 0,
    easeFactor: 2.5,
    status: "new",
    repetitions: 0,
  },
  {
    id: "neuro-2",
    front: "Define status epilepticus.",
    back: "Status epilepticus is a continuous seizure lasting >5 minutes OR two or more seizures without full recovery of consciousness between them. It's a medical emergency requiring immediate treatment.",
    category: "Neurology",
    interval: 7,
    easeFactor: 2.8,
    status: "review",
    repetitions: 5,
    lastReviewed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    nextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "peds-1",
    front: "What is the normal heart rate range for a newborn?",
    back: "100-160 bpm at rest. Newborns have higher baseline heart rates than adults due to smaller stroke volume and higher metabolic demands.",
    category: "Pediatrics",
    interval: 0,
    easeFactor: 2.5,
    status: "new",
    repetitions: 0,
  },
  {
    id: "peds-2",
    front: "Define failure to thrive (FTT).",
    back: "Failure to thrive is inadequate physical growth diagnosed by a child's growth falling below the 3rd-5th percentile or crossing two major percentile lines downward on growth charts.",
    category: "Pediatrics",
    interval: 2,
    easeFactor: 2.5,
    status: "learning",
    repetitions: 1,
    lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ethics-1",
    front: "What is informed consent?",
    back: "Informed consent is the process where a patient receives and understands information about a medical procedure, including risks, benefits, and alternatives, before voluntarily agreeing to treatment.",
    category: "Ethics",
    interval: 0,
    easeFactor: 2.5,
    status: "new",
    repetitions: 0,
  },
  {
    id: "ethics-2",
    front: "Define medical futility.",
    back: "Medical futility refers to interventions that have no reasonable chance of achieving the intended medical benefit or improving the patient's quality of life, making them ethically inappropriate.",
    category: "Ethics",
    interval: 4,
    easeFactor: 2.6,
    status: "review",
    repetitions: 3,
    lastReviewed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    nextReview: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
];

function calculateNextInterval(
  currentInterval: number,
  easeFactor: number,
  quality: "again" | "hard" | "good" | "easy"
): { interval: number; easeFactor: number } {
  let newInterval = currentInterval;
  let newEaseFactor = easeFactor;

  switch (quality) {
    case "again":
      newInterval = 0;
      newEaseFactor = Math.max(1.3, easeFactor - 0.2);
      break;
    case "hard":
      if (currentInterval === 0) {
        newInterval = 1;
      } else {
        newInterval = Math.max(1, Math.floor(currentInterval * 1.2));
      }
      newEaseFactor = Math.max(1.3, easeFactor - 0.15);
      break;
    case "good":
      if (currentInterval === 0) {
        newInterval = 1;
      } else if (currentInterval === 1) {
        newInterval = 4;
      } else {
        newInterval = Math.floor(currentInterval * easeFactor);
      }
      break;
    case "easy":
      if (currentInterval === 0) {
        newInterval = 4;
      } else {
        newInterval = Math.floor(currentInterval * easeFactor * 1.3);
      }
      newEaseFactor = Math.min(2.5, easeFactor + 0.15);
      break;
  }

  return { interval: newInterval, easeFactor: newEaseFactor };
}

type ViewMode = "deck-overview" | "study-session";

export default function FlashcardsPage() {
  const [deck, setDeck] = useState<Flashcard[]>(DUMMY_DECK);
  const [viewMode, setViewMode] = useState<ViewMode>("deck-overview");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const filteredCards = useMemo(() => {
    if (!selectedCategory) return deck;
    return deck.filter((card) => card.category === selectedCategory);
  }, [deck, selectedCategory]);

  const reviewQueue = useMemo(() => {
    const now = new Date();
    return filteredCards.filter((card) => {
      if (card.status === "new") return true;
      if (card.status === "review" && card.nextReview && card.nextReview <= now) return true;
      if (card.status === "learning") return true;
      return false;
    });
  }, [filteredCards]);

  const newCards = useMemo(() => {
    return filteredCards.filter((card) => card.status === "new");
  }, [filteredCards]);

  const masteredCards = useMemo(() => {
    return filteredCards.filter((card) => card.status === "review" && card.repetitions >= 5);
  }, [filteredCards]);

  const currentCard = reviewQueue[currentCardIndex];

  const handleStartSession = (category?: string) => {
    setSelectedCategory(category || null);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setViewMode("study-session");
  };

  const handleSRSResponse = (quality: "again" | "hard" | "good" | "easy") => {
    if (!currentCard) return;

    const { interval, easeFactor } = calculateNextInterval(
      currentCard.interval,
      currentCard.easeFactor,
      quality
    );

    const now = new Date();
    const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

    const updatedCard: Flashcard = {
      ...currentCard,
      interval,
      easeFactor,
      status: interval === 0 ? "learning" : interval < 7 ? "learning" : "review",
      lastReviewed: now,
      nextReview: interval > 0 ? nextReview : undefined,
      repetitions: quality === "again" ? 0 : currentCard.repetitions + 1,
    };

    setDeck((prev) => prev.map((card) => (card.id === updatedCard.id ? updatedCard : card)));

    setIsFlipped(false);
    if (currentCardIndex < reviewQueue.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setViewMode("deck-overview");
      setCurrentCardIndex(0);
    }
  };

  const cardsByCategory = useMemo(() => {
    const grouped: Record<string, Flashcard[]> = {};
    deck.forEach((card) => {
      if (!grouped[card.category]) {
        grouped[card.category] = [];
      }
      grouped[card.category].push(card);
    });
    return grouped;
  }, [deck]);

  const progress = reviewQueue.length > 0 ? ((currentCardIndex + 1) / reviewQueue.length) * 100 : 0;

  // Skeleton Component
  function SkeletonCard({ className = "" }: { className?: string }) {
    return (
      <div className={`bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  // Empty State
  function EmptyState() {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <Brain className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">All Caught Up!</h3>
          <p className="text-slate-500 mb-6">No cards due for review. Great job on staying on top of your studies!</p>
          <button
            onClick={() => handleStartSession()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Play className="w-5 h-5" />
            Start New Cards
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <Layout>
      <div className="p-6 lg:p-8 bg-[#F8FAFC] min-h-full">
        <AnimatePresence mode="wait">
          {viewMode === "deck-overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto space-y-6"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
              >
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Flashcards</h1>
                  <p className="text-slate-500 mt-1">Spaced repetition for long-term retention</p>
                </div>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-50">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{reviewQueue.length}</p>
                      <p className="text-sm text-slate-500">To Review</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{newCards.length}</p>
                      <p className="text-sm text-slate-500">New Cards</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-50">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{masteredCards.length}</p>
                      <p className="text-sm text-slate-500">Mastered</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-50">
                      <Layers className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{deck.length}</p>
                      <p className="text-sm text-slate-500">Total Cards</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Start Banner */}
              {reviewQueue.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Play className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Ready to Review?</h3>
                        <p className="text-blue-100 text-sm">
                          You have {reviewQueue.length} cards waiting for review. Keep your streak alive!
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartSession()}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                    >
                      Start Session
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Decks by Category */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Decks by Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.keys(subjectCategories).map((category) => {
                    const categoryCards = cardsByCategory[category] || [];
                    const categoryReview = categoryCards.filter((card) => {
                      if (card.status === "new") return true;
                      if (card.status === "review" && card.nextReview && card.nextReview <= new Date()) return true;
                      if (card.status === "learning") return true;
                      return false;
                    }).length;

                    return (
                      <motion.button
                        key={category}
                        onClick={() => handleStartSession(category)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 text-left hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                            {category}
                          </span>
                          {categoryReview > 0 && (
                            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                              {categoryReview} due
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                          {category} Deck
                        </h3>
                        <p className="text-sm text-slate-500">{categoryCards.length} cards</p>
                        <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(categoryReview / Math.max(categoryCards.length, 1)) * 100}%` }}
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {reviewQueue.length === 0 && deck.length > 0 && <EmptyState />}
            </motion.div>
          ) : (
            <motion.div
              key="session"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => {
                    setViewMode("deck-overview");
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span className="font-medium">Exit</span>
                </button>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-800">{currentCardIndex + 1} / {reviewQueue.length}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Category Badge */}
              {currentCard && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                    <Brain className="w-3 h-3" />
                    {currentCard.category}
                  </span>
                </div>
              )}

              {/* Flip Card */}
              {currentCard && (
                <FlipCard
                  front={currentCard.front}
                  back={currentCard.back}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(true)}
                />
              )}

              {/* SRS Buttons */}
              {isFlipped && currentCard && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  <button
                    onClick={() => handleSRSResponse("again")}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-red-50 border border-red-100 hover:bg-red-100 text-red-700 transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span className="text-sm font-medium">Again</span>
                    <span className="text-xs opacity-70">&lt;1m</span>
                  </button>

                  <button
                    onClick={() => handleSRSResponse("hard")}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-amber-50 border border-amber-100 hover:bg-amber-100 text-amber-700 transition-all"
                  >
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">Hard</span>
                    <span className="text-xs opacity-70">2d</span>
                  </button>

                  <button
                    onClick={() => handleSRSResponse("good")}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-700 transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Good</span>
                    <span className="text-xs opacity-70">4d</span>
                  </button>

                  <button
                    onClick={() => handleSRSResponse("easy")}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-700 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium">Easy</span>
                    <span className="text-xs opacity-70">7d</span>
                  </button>
                </motion.div>
              )}

              {/* Tap to Flip Prompt */}
              {!isFlipped && currentCard && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 text-center"
                >
                  <p className="text-sm text-slate-400">Tap card to reveal answer</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
