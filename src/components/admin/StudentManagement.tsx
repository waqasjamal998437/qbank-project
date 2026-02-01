"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  Eye,
  Mail,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Calendar,
  ChevronDown,
  X
} from "lucide-react";

// Dummy students data
const dummyStudents = [
  { id: 1, name: "Sarah Chen", email: "sarah.chen@ayub.edu", university: "Ayub Medical College", year: "MS3", subscription: "Pro", joined: "2024-01-10", lastActive: "2 hours ago", score: 87, streak: 23 },
  { id: 2, name: "Marcus Johnson", email: "marcus.j@ayub.edu", university: "Ayub Medical College", year: "MS4", subscription: "Student Life", joined: "2023-06-15", lastActive: "30 mins ago", score: 92, streak: 45 },
  { id: 3, name: "Emily Rodriguez", email: "emily.r@uni.edu", university: "UCLA", year: "MS2", subscription: "Standard", joined: "2024-01-20", lastActive: "1 day ago", score: 74, streak: 5 },
  { id: 4, name: "James Wilson", email: "james.w@ayub.edu", university: "Ayub Medical College", year: "MS1", subscription: "Pro", joined: "2024-01-25", lastActive: "5 hours ago", score: 68, streak: 12 },
  { id: 5, name: "Lisa Park", email: "lisa.p@medical.edu", university: "Johns Hopkins", year: "MS3", subscription: "Student Life", joined: "2023-09-01", lastActive: "1 hour ago", score: 95, streak: 67 },
  { id: 6, name: "Ahmed Hassan", email: "ahmed.h@ayub.edu", university: "Ayub Medical College", year: "MS2", subscription: "Pro", joined: "2023-12-10", lastActive: "3 days ago", score: 71, streak: 0 },
  { id: 7, name: "Priya Sharma", email: "priya.s@ayub.edu", university: "Ayub Medical College", year: "MS4", subscription: "Student Life", joined: "2023-03-20", lastActive: "30 mins ago", score: 89, streak: 34 },
  { id: 8, name: "Michael Brown", email: "michael.b@uni.edu", university: "Stanford", year: "MS1", subscription: "Standard", joined: "2024-01-28", lastActive: "2 days ago", score: 62, streak: 3 },
];

const universities = ["Ayub Medical College", "UCLA", "Johns Hopkins", "Stanford", "Harvard"];
const years = ["MS1", "MS2", "MS3", "MS4"];
const subscriptions = ["Standard", "Pro", "Student Life"];

// Performance data for a student
const performanceData = {
  overallScore: 87,
  questionsAnswered: 1247,
  averageTime: "1m 42s",
  strongAreas: ["Cardiology", "Pharmacology", "Neurology"],
  weakAreas: ["Microbiology", "Anatomy"],
  recentTests: [
    { name: "Cardiology Shelf", score: 92, date: "2024-01-25" },
    { name: "Pharmacology Quiz", score: 88, date: "2024-01-24" },
    { name: "Neurology Block", score: 85, date: "2024-01-22" },
    { name: "Microbiology Test", score: 72, date: "2024-01-20" },
  ],
  weeklyProgress: [
    { day: "Mon", score: 85 },
    { day: "Tue", score: 88 },
    { day: "Wed", score: 82 },
    { day: "Thu", score: 90 },
    { day: "Fri", score: 87 },
    { day: "Sat", score: 92 },
    { day: "Sun", score: 89 },
  ],
};

export default function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<typeof dummyStudents[0] | null>(null);

  const filteredStudents = dummyStudents.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUniversity = !selectedUniversity || student.university === selectedUniversity;
    const matchesYear = !selectedYear || student.year === selectedYear;
    const matchesSubscription = !selectedSubscription || student.subscription === selectedSubscription;
    return matchesSearch && matchesUniversity && matchesYear && matchesSubscription;
  });

  const renderStudentList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Students</h2>
          <p className="text-sm text-gray-500">{filteredStudents.length} students found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="">All Universities</option>
                {universities.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="">All Years</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedSubscription}
                onChange={(e) => setSelectedSubscription(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="">All Subscriptions</option>
                {subscriptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">University</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscription</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Streak</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/150?img=${student.id + 10}`}
                        alt={student.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.university}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{student.year}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                      student.subscription === 'Student Life' ? 'bg-purple-50 text-purple-600' :
                      student.subscription === 'Pro' ? 'bg-indigo-50 text-indigo-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {student.subscription}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        student.score >= 80 ? 'text-green-600' : student.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {student.score}%
                      </span>
                      {student.score >= 80 && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {student.score < 70 && <TrendingDown className="w-4 h-4 text-red-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{student.streak} days</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.lastActive}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStudentProfile = () => (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => setSelectedStudent(null)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-2"
        >
          ← Back to Students
        </button>
        <div className="flex items-center gap-4">
          <img
            src={`https://i.pravatar.cc/150?img=${selectedStudent!.id + 10}`}
            alt={selectedStudent!.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{selectedStudent!.name}</h2>
            <p className="text-sm text-gray-500">{selectedStudent!.university} • {selectedStudent!.year}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          {/* Overall Score Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#6366f1"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${performanceData.overallScore * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{performanceData.overallScore}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">Overall Score</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Questions Answered</span>
              <span className="font-semibold text-gray-900">{performanceData.questionsAnswered}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Time</span>
              <span className="font-semibold text-gray-900">{performanceData.averageTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Study Streak</span>
              <span className="font-semibold text-green-600">{selectedStudent!.streak} days</span>
            </div>
          </div>

          {/* Strong Areas */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Strong Areas</h3>
            <div className="flex flex-wrap gap-2">
              {performanceData.strongAreas.map((area) => (
                <span key={area} className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-lg">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Weak Areas */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Areas to Improve</h3>
            <div className="flex flex-wrap gap-2">
              {performanceData.weakAreas.map((area) => (
                <span key={area} className="text-xs font-medium bg-red-50 text-red-600 px-2 py-1 rounded-lg">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Charts & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Progress */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
            <div className="flex items-end justify-between gap-2 h-40">
              {performanceData.weeklyProgress.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-indigo-100 rounded-t-lg transition-all duration-300"
                    style={{ height: `${day.score}%`, minHeight: '4px' }}
                  >
                    <div 
                      className="w-full bg-indigo-500 rounded-t-lg"
                      style={{ height: '100%' }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tests */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Test Results</h3>
            <div className="space-y-3">
              {performanceData.recentTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      test.score >= 80 ? 'bg-green-100' : test.score >= 70 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <BookOpen className={`w-5 h-5 ${
                        test.score >= 80 ? 'text-green-600' : test.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{test.name}</p>
                      <p className="text-xs text-gray-500">{test.date}</p>
                    </div>
                  </div>
                  <span className={`text-lg font-semibold ${
                    test.score >= 80 ? 'text-green-600' : test.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {test.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 min-h-full">
      {selectedStudent ? renderStudentProfile() : renderStudentList()}
    </div>
  );
}
