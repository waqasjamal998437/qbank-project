"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Layers, Play, FileQuestion, Database } from "lucide-react";

interface Stats {
  flashcards: number;
  videos: number;
  quizzes: number;
  totalContent: number;
}

export function ContentOverview() {
  const [stats, setStats] = useState<Stats>({
    flashcards: 0,
    videos: 0,
    quizzes: 0,
    totalContent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Flashcards",
      value: stats.flashcards,
      icon: Layers,
      color: "emerald",
    },
    {
      label: "Videos",
      value: stats.videos,
      icon: Play,
      color: "emerald",
    },
    {
      label: "Quiz Questions",
      value: stats.quizzes,
      icon: FileQuestion,
      color: "emerald",
    },
    {
      label: "Total Content",
      value: stats.totalContent,
      icon: Database,
      color: "emerald",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  {card.label}
                </p>
                <Icon className="w-5 h-5 text-emerald-500" />
              </div>
              {isLoading ? (
                <div className="h-8 w-16 bg-slate-800 rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-bold text-slate-100">{card.value}</p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/flashcards"
            className="p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-emerald-500/50 transition-all group"
          >
            <Layers className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-medium text-slate-200 mb-1">Create Flashcard</h3>
            <p className="text-xs text-slate-400">Add a new flashcard to the system</p>
          </Link>
          <Link
            href="/admin/videos"
            className="p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-emerald-500/50 transition-all group"
          >
            <Play className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-medium text-slate-200 mb-1">Add Video</h3>
            <p className="text-xs text-slate-400">Upload a new educational video</p>
          </Link>
          <Link
            href="/admin/quizzes"
            className="p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-emerald-500/50 transition-all group"
          >
            <FileQuestion className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-medium text-slate-200 mb-1">Build Quiz</h3>
            <p className="text-xs text-slate-400">Create a new quiz question</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
