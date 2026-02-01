"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "../../components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import {
  BookOpen,
  TrendingUp,
  Target,
  Calendar,
  Brain,
  Flame,
  Trophy,
  ChevronRight,
  Activity,
} from "lucide-react";

const DUMMY_ANALYTICS = {
  activity: [
    { day: "Mon", count: 12 },
    { day: "Tue", count: 19 },
    { day: "Wed", count: 15 },
    { day: "Thu", count: 22 },
    { day: "Fri", count: 18 },
    { day: "Sat", count: 8 },
    { day: "Sun", count: 14 },
  ],
  performance: [
    { subject: "Cardiology", score: 88, fullMark: 100 },
    { subject: "Neurology", score: 75, fullMark: 100 },
    { subject: "Pediatrics", score: 92, fullMark: 100 },
    { subject: "Ethics", score: 65, fullMark: 100 },
    { subject: "Surgery", score: 80, fullMark: 100 },
    { subject: "Pharmacology", score: 85, fullMark: 100 },
  ],
  trends: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      accuracy: 70 + Math.random() * 20,
      questions: Math.floor(Math.random() * 30) + 5,
    };
  }),
  stats: {
    totalQuestions: 1240,
    avgAccuracy: 88,
    streak: 12,
    todayProgress: 75,
    rank: 156,
    totalUsers: 1250,
  },
};

interface StatsData {
  activity: { day: string; count: number }[];
  accuracy: number;
  categories: { name: string; score: number }[];
  total: number;
  todayCount: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        if (data && typeof data === "object") {
          setStats(data);
        } else {
          setStats(null);
        }
      } catch (error) {
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const displayData = stats && stats.total > 0 ? {
    activity: stats.activity,
    performance: stats.categories.map((cat) => ({
      subject: cat.name,
      score: cat.score,
      fullMark: 100,
    })),
    trends: DUMMY_ANALYTICS.trends,
    stats: {
      totalQuestions: stats.total,
      avgAccuracy: stats.accuracy,
      streak: 12,
      todayProgress: stats.todayCount,
      rank: 156,
      totalUsers: 1250,
    },
  } : DUMMY_ANALYTICS;

  const hasNoData = stats !== null && stats.total === 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3">
          <p className="text-sm font-medium text-slate-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-slate-500">
              {entry.name}: {entry.value.toFixed(1)}
              {entry.dataKey === "accuracy" ? "%" : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
            <Activity className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Data Yet</h3>
          <p className="text-slate-500 mb-6">Answer questions to track your performance and see detailed analytics here.</p>
          <a
            href="/study"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Start Practicing
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </motion.div>
    );
  }

  if (!isMounted) {
    return null;
  }

  return (
    <Layout>
      <div className="p-6 lg:p-8 bg-[#F8FAFC] min-h-full">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Performance Analytics</h1>
              <p className="text-slate-500 mt-1">Track your progress and identify areas for improvement</p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
              {[
                { key: "7d", label: "7 Days" },
                { key: "30d", label: "30 Days" },
                { key: "90d", label: "90 Days" },
              ].map((range) => (
                <button
                  key={range.key}
                  onClick={() => setTimeRange(range.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range.key
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : hasNoData ? (
            <EmptyState />
          ) : (
            <>
              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-5 gap-4"
              >
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{displayData.stats.totalQuestions.toLocaleString()}</p>
                      <p className="text-sm text-slate-500">Total Questions</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-50">
                      <Target className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{displayData.stats.avgAccuracy}%</p>
                      <p className="text-sm text-slate-500">Avg Accuracy</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-orange-50">
                      <Flame className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{displayData.stats.streak}</p>
                      <p className="text-sm text-slate-500">Day Streak</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-50">
                      <Trophy className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">#{displayData.stats.rank}</p>
                      <p className="text-sm text-slate-500">Global Rank</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-50">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{displayData.stats.todayProgress}%</p>
                      <p className="text-sm text-slate-500">Today's Goal</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-800">Weekly Activity</h2>
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={displayData.activity}>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="url(#barGradient)" animationDuration={1500} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Progress Trend */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-800">Accuracy Trend</h2>
                    <Activity className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={displayData.trends}>
                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 10 }}
                          interval={4}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          domain={[0, 100]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="accuracy"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fill="url(#areaGradient)"
                          animationDuration={1500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              {/* Category Performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Category Strength</h2>
                    <p className="text-sm text-slate-500 mt-1">Your performance across different medical systems</p>
                  </div>
                  <Brain className="w-5 h-5 text-slate-400" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={displayData.performance}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fill: "#64748b", fontSize: 12 }}
                        />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip content={<CustomTooltip />} formatter={(value: number) => `${value}%`} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {displayData.performance
                      .sort((a, b) => b.score - a.score)
                      .map((item, index) => (
                        <div key={item.subject} className="flex items-center gap-4">
                          <div className="w-32 font-medium text-slate-700 text-sm">{item.subject}</div>
                          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                item.score >= 80 ? "bg-emerald-500" : item.score >= 60 ? "bg-amber-500" : "bg-red-500"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${item.score}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                            />
                          </div>
                          <div className="w-12 text-right">
                            <span
                              className={`text-sm font-semibold ${
                                item.score >= 80 ? "text-emerald-600" : item.score >= 60 ? "text-amber-600" : "text-red-600"
                              }`}
                            >
                              {item.score}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>

              {/* Insights Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Performance Insights</h3>
                    <ul className="space-y-2 text-blue-100 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        Your accuracy has improved by 5% over the last 30 days
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        Pediatrics is your strongest category (92% accuracy)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        Consider reviewing Ethics to improve your overall score
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
