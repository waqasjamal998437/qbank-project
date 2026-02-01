"use client";

import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  Activity,
  UserPlus,
  CheckCircle,
  Clock,
  Settings
} from "lucide-react";

// Dummy statistics data
const stats = [
  { 
    label: "Total Students", 
    value: "12,847", 
    change: "+12%", 
    icon: Users, 
    color: "from-blue-500 to-cyan-500" 
  },
  { 
    label: "Active Subscriptions", 
    value: "8,234", 
    change: "+8%", 
    icon: Award, 
    color: "from-purple-500 to-pink-500" 
  },
  { 
    label: "Questions in Bank", 
    value: "15,432", 
    change: "+234", 
    icon: BookOpen, 
    color: "from-orange-500 to-red-500" 
  },
  { 
    label: "Avg. Peer Score", 
    value: "76.4%", 
    change: "+2.1%", 
    icon: TrendingUp, 
    color: "from-green-500 to-emerald-500" 
  },
];

// Dummy activity feed data
const activityFeed = [
  { 
    id: 1, 
    type: "signup", 
    user: "Sarah Chen", 
    action: "signed up", 
    time: "2 minutes ago",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  { 
    id: 2, 
    type: "test", 
    user: "Marcus Johnson", 
    action: "completed Cardiology block", 
    score: "92%",
    time: "15 minutes ago",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  { 
    id: 3, 
    type: "subscription", 
    user: "Emily Rodriguez", 
    action: "upgraded to Pro", 
    time: "1 hour ago",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  { 
    id: 4, 
    type: "signup", 
    user: "James Wilson", 
    action: "signed up", 
    time: "2 hours ago",
    avatar: "https://i.pravatar.cc/150?img=8"
  },
  { 
    id: 5, 
    type: "test", 
    user: "Lisa Park", 
    action: "completed Pharmacology quiz", 
    score: "88%",
    time: "3 hours ago",
    avatar: "https://i.pravatar.cc/150?img=9"
  },
];

// Recent questions added
const recentQuestions = [
  { id: 1, subject: "Cardiology", topic: "Heart Failure", difficulty: "Medium", added: "1 hour ago" },
  { id: 2, subject: "Neurology", topic: "Stroke Management", difficulty: "Hard", added: "3 hours ago" },
  { id: 3, subject: "Pharmacology", topic: "Beta Blockers", difficulty: "Easy", added: "5 hours ago" },
  { id: 4, subject: "Pathology", topic: "Cancer Markers", difficulty: "Medium", added: "Yesterday" },
];

export default function DashboardOverview() {
  return (
    <div className="p-6 lg:p-8 min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with your QBank.</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    {stat.change}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm">{stat.label}</p>
               text-gray-500</div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <img
                    src={activity.avatar}
                    alt={activity.user}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>
                      {' '}{activity.action}
                      {activity.score && (
                        <span className="text-green-600 font-medium"> ({activity.score})</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'signup' ? 'bg-blue-50' :
                    activity.type === 'test' ? 'bg-green-50' : 'bg-purple-50'
                  }`}>
                    {activity.type === 'signup' && <UserPlus className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'test' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {activity.type === 'subscription' && <Activity className="w-4 h-4 text-purple-600" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Questions Added */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Questions</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentQuestions.map((question) => (
                <div key={question.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {question.subject}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      question.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
                      question.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{question.topic}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Added {question.added}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Add Question</p>
              <p className="text-xs text-gray-500">Create new QBank content</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Manage Users</p>
              <p className="text-xs text-gray-500">View student profiles</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">View Analytics</p>
              <p className="text-xs text-gray-500">Platform insights</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Settings</p>
              <p className="text-xs text-gray-500">Configure platform</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
