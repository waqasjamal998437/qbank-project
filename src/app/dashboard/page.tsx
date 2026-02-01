"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "../../components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  Flame,
  Target,
  Brain,
  ChevronRight,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

// Types
interface DashboardStats {
  totalQuestions: number;
  averageAccuracy: number;
  dailyStreak: number;
  estimatedScore: number;
  accuracyTrend: "up" | "down" | "neutral";
}

interface RecentActivity {
  id: string;
  title: string;
  system: string;
  score: number;
  date: string;
  questionCount: number;
}

interface StudyRecommendation {
  type: "weakness" | "strength" | "suggestion";
  title: string;
  description: string;
  action: string;
  system: string;
}

// Mock data for development
const mockSystemData = [
  { system: "Cardiology", correct: 85, total: 100 },
  { system: "Neurology", correct: 72, total: 100 },
  { system: "Renal", correct: 58, total: 100 },
  { system: "GI", correct: 78, total: 100 },
  { system: "Pulmonology", correct: 82, total: 100 },
  { system: "Endocrine", correct: 69, total: 100 },
];

const mockRecentActivity: RecentActivity[] = [
  {
    id: "1",
    title: "Cardiology Block 1",
    system: "Cardiology",
    score: 82,
    date: "Today",
    questionCount: 20,
  },
  {
    id: "2",
    title: "Neurology Mixed",
    system: "Neurology",
    score: 68,
    date: "Yesterday",
    questionCount: 25,
  },
  {
    id: "3",
    title: "Renal Pathology",
    system: "Renal",
    score: 74,
    date: "2 days ago",
    questionCount: 15,
  },
];

const mockRecommendation: StudyRecommendation = {
  type: "weakness",
  title: "Renal Pathology Weakness Detected",
  description:
    "Your performance in Renal System questions is below average. Focus on glomerular diseases and fluid electrolyte balance.",
  action: "Start 20-question Renal block",
  system: "Renal",
};

const emptyRecommendation: StudyRecommendation = {
  type: "suggestion",
  title: "Welcome to QBank!",
  description:
    "Start your first practice session to unlock personalized recommendations based on your performance.",
  action: "Start Your First Test",
  system: "General",
};

// Skeleton Components
function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 ${className}`}
    >
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

function SkeletonChart({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 ${className}`}
    >
      <div className="animate-pulse space-y-4">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-48 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function SkeletonActivityFeed({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 ${className}`}
    >
      <div className="animate-pulse space-y-4">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Stat Card Component with Circular Progress
function StatCardWithProgress({
  title,
  value,
  subtitle,
  icon: Icon,
  progress,
  trend,
  color = "blue",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  progress?: number;
  trend?: "up" | "down" | "neutral";
  color?: "blue" | "green" | "orange" | "purple";
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    orange: "from-orange-500 to-orange-600",
    purple: "from-purple-500 to-purple-600",
  };

  const bgColorClasses = {
    blue: "bg-blue-50",
    green: "bg-emerald-50",
    orange: "bg-orange-50",
    purple: "bg-purple-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-xl ${bgColorClasses[color]} bg-gradient-to-br ${colorClasses[color]} bg-clip-padding`}
        >
          <Icon className={`w-5 h-5 text-white`} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend === "up"
                ? "text-emerald-600"
                : trend === "down"
                  ? "text-red-500"
                  : "text-gray-500"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend === "down" ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        {progress !== undefined && (
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="#f1f5f9"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke={colorClasses[color].split(" ")[1].replace("to-", "#")}
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${progress * 1.51} 151`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Empty State Component
function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center"
    >
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          No Activity Yet
        </h3>
        <p className="text-slate-500 mb-6">
          Start your first practice session to track your progress and get
          personalized recommendations.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Play className="w-5 h-5" />
          Start Your First Test
        </button>
      </div>
    </motion.div>
  );
}

// Main Dashboard Component
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recommendation, setRecommendation] = useState<StudyRecommendation | null>(
    null
  );
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate loading

      // Mock data - replace with actual API calls
      setStats({
        totalQuestions: 1247,
        averageAccuracy: 73,
        dailyStreak: 12,
        estimatedScore: 225,
        accuracyTrend: "up",
      });

      setRecentActivity(mockRecentActivity);
      setRecommendation(mockRecommendation);
      setHasData(true);
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  const handleStartTest = () => {
    // Navigate to exam simulation
    window.location.href = "/exam-sim";
  };

  // Calculate chart data
  const chartData = mockSystemData.map((item) => ({
    name: item.system,
    accuracy: Math.round((item.correct / item.total) * 100),
    fill: item.correct / item.total >= 0.7
      ? "#10b981"
      : item.correct / item.total >= 0.5
        ? "#f59e0b"
        : "#ef4444",
  }));

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white rounded-lg shadow-lg p-3 border border-slate-100">
          <p className="font-medium text-slate-800">{data.name}</p>
          <p className="text-sm text-slate-500">
            Accuracy: {data.accuracy}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (!isLoading && !hasData) {
    return (
      <Layout>
        <div className="p-6 lg:p-8 bg-[#F8FAFC] min-h-full">
          <EmptyState onStart={handleStartTest} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 lg:p-8 bg-[#F8FAFC] min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Welcome back! Here's your learning progress.
          </p>
        </motion.div>

        {/* Top Row - Quick Stats (Bento Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {isLoading ? (
            <>
              <SkeletonCard className="h-36" />
              <SkeletonCard className="h-36" />
              <SkeletonCard className="h-36" />
              <SkeletonCard className="h-36" />
            </>
          ) : stats ? (
            <>
              <StatCardWithProgress
                title="Total Questions"
                value={stats.totalQuestions.toLocaleString()}
                icon={BookOpen}
                progress={Math.min((stats.totalQuestions / 2000) * 100, 100)}
                color="blue"
              />
              <StatCardWithProgress
                title="Average Accuracy"
                value={`${stats.averageAccuracy}%`}
                icon={Target}
                trend={stats.accuracyTrend}
                color="green"
              />
              <StatCardWithProgress
                title="Daily Streak"
                value={`${stats.dailyStreak} days`}
                icon={Flame}
                color="orange"
              />
              <StatCardWithProgress
                title="Estimated Score"
                value={stats.estimatedScore}
                subtitle="Predicted Step 1"
                icon={Brain}
                color="purple"
              />
            </>
          ) : null}
        </div>

        {/* Middle Row - Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left (2/3) - Performance Chart */}
          {isLoading ? (
            <SkeletonChart className="lg:col-span-2 h-80" />
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-800">
                  Performance by System
                </h2>
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>All time</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    barSize={32}
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                    <Bar
                      dataKey="accuracy"
                      radius={[8, 8, 0, 0]}
                      animationDuration={1000}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Right (1/3) - Recent Activity Feed */}
          {isLoading ? (
            <SkeletonActivityFeed className="h-80" />
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-800">
                  Recent Activity
                </h2>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="group relative flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer bg-slate-50/50"
                  >
                    {/* Score Badge */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                        activity.score >= 70
                          ? "bg-emerald-100 text-emerald-700"
                          : activity.score >= 50
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {activity.score}%
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate text-sm">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                          {activity.system}
                        </span>
                        <span className="text-xs text-slate-400">
                          {activity.questionCount} questions
                        </span>
                      </div>
                    </div>
                    {/* Date */}
                    <div className="flex-shrink-0">
                      <span className="text-xs text-slate-400 font-medium">
                        {activity.date}
                      </span>
                    </div>
                    {/* Arrow */}
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Row - Study Recommendation */}
        {isLoading ? (
          <SkeletonCard className="h-40" />
        ) : recommendation ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {recommendation.title}
                  </h3>
                  <p className="text-blue-100 text-sm max-w-xl">
                    {recommendation.description}
                  </p>
                </div>
              </div>
              <button
                onClick={handleStartTest}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                <Play className="w-5 h-5" />
                {recommendation.action}
              </button>
            </div>
          </motion.div>
        ) : null}
      </div>
    </Layout>
  );
}
