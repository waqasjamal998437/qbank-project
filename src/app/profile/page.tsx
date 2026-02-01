"use client";

import { useState } from "react";
import { 
  User, 
  Award, 
  CreditCard, 
  Shield,
  Save,
  Camera,
  ChevronDown,
  TrendingUp,
  BookOpen,
  BarChart3,
  RefreshCw,
  Calendar
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

// Dummy data for performance chart
const performanceData = [
  { system: "Cardiovascular", score: 82, color: "#6366f1" },
  { system: "Renal", score: 68, color: "#8b5cf6" },
  { system: "Respiratory", score: 74, color: "#a855f7" },
  { system: "GI/Hepatic", score: 71, color: "#c084fc" },
  { system: "Endocrine", score: 85, color: "#6366f1" },
  { system: "Neurology", score: 65, color: "#8b5cf6" },
  { system: "Psychiatry", score: 79, color: "#a855f7" },
];

// User profile dummy data
const userData = {
  fullName: "Sarah Chen",
  email: "sarah.chen@ayub.edu",
  medicalSchool: "Ayub Medical College",
  currentYear: "MS3",
  graduationYear: "2026",
  avatar: "https://i.pravatar.cc/150?img=1",
  subscription: {
    plan: "Professional",
    daysRemaining: 180,
    totalDays: 365,
    price: "$249/year",
  },
  performance: {
    totalQuestions: 2456,
    totalQuestionsGoal: 5000,
    averageAccuracy: 68,
    globalRank: 72,
    percentile: 72,
  },
};

// Tab components
const GeneralTab = () => (
  <div className="space-y-6">
    {/* Profile Picture */}
    <div className="flex items-center gap-6">
      <div className="relative">
        <img
          src={userData.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
        <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-600 transition-colors">
          <Camera className="w-4 h-4" />
        </button>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>
        <p className="text-sm text-gray-500 mb-2">Upload a new profile picture</p>
        <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
          Change Photo
        </button>
      </div>
    </div>

    {/* Form Fields */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          defaultValue={userData.fullName}
          className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          defaultValue={userData.email}
          className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Medical School</label>
        <input
          type="text"
          defaultValue={userData.medicalSchool}
          className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Year</label>
        <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none">
          <option value="ms1" selected={userData.currentYear === "MS1"}>MS1 - First Year</option>
          <option value="ms2" selected={userData.currentYear === "MS2"}>MS2 - Second Year</option>
          <option value="ms3" selected={userData.currentYear === "MS3"}>MS3 - Third Year</option>
          <option value="ms4" selected={userData.currentYear === "MS4"}>MS4 - Fourth Year</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation</label>
        <input
          type="text"
          defaultValue={userData.graduationYear}
          className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
      </div>
    </div>
  </div>
);

const PerformanceTab = () => {
  const progress = (userData.performance.totalQuestions / userData.performance.totalQuestionsGoal) * 100;
  
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Questions Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {userData.performance.totalQuestions.toLocaleString()}
                <span className="text-sm font-normal text-gray-400">/{userData.performance.totalQuestionsGoal.toLocaleString()}</span>
              </p>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{progress.toFixed(1)}% of goal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">{userData.performance.averageAccuracy}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">+2.3% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Global Rank</p>
              <p className="text-2xl font-bold text-gray-900">{userData.performance.percentile}th</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Percentile</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance by System</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis type="category" dataKey="system" tickLine={false} axisLine={false} tick={{ fill: '#374151', fontSize: 12 }} width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: 'none', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const SubscriptionTab = () => {
  const progress = (userData.subscription.daysRemaining / userData.subscription.totalDays) * 100;
  
  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6" />
            <span className="text-sm opacity-80">Current Plan</span>
          </div>
          <h3 className="text-3xl font-bold mb-2">{userData.subscription.plan}</h3>
          <p className="text-lg opacity-90">{userData.subscription.price}</p>
          
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-80">Days Remaining</span>
              <span className="font-semibold">{userData.subscription.daysRemaining} days</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all">
          <RefreshCw className="w-5 h-5" />
          Renew Subscription
        </button>
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all">
          <BarChart3 className="w-5 h-5" />
          Reset QBank Statistics
        </button>
      </div>

      {/* Plan Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Plan Includes</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Access to 15,000+ questions",
            "Advanced analytics & insights",
            "Priority support",
            "Mock exams & simulations",
            "Detailed explanations",
            "Mobile app access",
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SecurityTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Shield className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Password</p>
                <p className="text-xs text-gray-500">Last changed 30 days ago</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Change Password
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Add an extra layer of security</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Active Sessions</p>
                <p className="text-xs text-gray-500">Manage your logged-in devices</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              View Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Profile Page Component
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "performance", label: "Performance", icon: Award },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralTab />;
      case "performance":
        return <PerformanceTab />;
      case "subscription":
        return <SubscriptionTab />;
      case "security":
        return <SecurityTab />;
      default:
        return <GeneralTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
            
            {/* Profile Info - Right Side */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{userData.fullName}</p>
                <p className="text-xs text-gray-500">{userData.medicalSchool}</p>
              </div>
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-100"
              />
              <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all">
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save Changes</span>
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-1 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
