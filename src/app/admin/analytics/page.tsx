"use client";

import { TrendingUp, TrendingDown, Users, BookOpen, Award, Clock } from "lucide-react";

// Dummy analytics data
const analyticsData = {
  totalRevenue: 125840,
  revenueGrowth: 18.5,
  activeUsers: 8423,
  userGrowth: 12.3,
  completionRate: 78.4,
  completionGrowth: 5.2,
  avgScore: 76.2,
  scoreGrowth: 2.8,
  monthlyData: [
    { month: "Jul", revenue: 85000, users: 5200 },
    { month: "Aug", revenue: 92000, users: 5800 },
    { month: "Sep", revenue: 98000, users: 6200 },
    { month: "Oct", revenue: 105000, users: 6800 },
    { month: "Nov", revenue: 112000, users: 7400 },
    { month: "Dec", revenue: 125840, users: 8423 },
  ],
  topSubjects: [
    { name: "Cardiology", questions: 1247, completion: 82 },
    { name: "Neurology", questions: 1102, completion: 78 },
    { name: "Pharmacology", questions: 986, completion: 85 },
    { name: "Pathology", questions: 876, completion: 71 },
    { name: "Microbiology", questions: 743, completion: 68 },
  ],
  deviceBreakdown: [
    { device: "Desktop", percentage: 62 },
    { device: "Mobile", percentage: 31 },
    { device: "Tablet", percentage: 7 },
  ],
};

export default function AnalyticsPage() {
  const maxRevenue = Math.max(...analyticsData.monthlyData.map(d => d.revenue));

  return (
    <div className="p-6 lg:p-8 min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-500">Platform performance and insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                +{analyticsData.revenueGrowth}%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">${analyticsData.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Revenue</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                +{analyticsData.userGrowth}%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{analyticsData.activeUsers.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Active Users</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                +{analyticsData.completionGrowth}%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{analyticsData.completionRate}%</p>
            <p className="text-sm text-gray-500">Completion Rate</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                +{analyticsData.scoreGrowth}%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{analyticsData.avgScore}%</p>
            <p className="text-sm text-gray-500">Average Score</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Overview</h3>
            <div className="flex items-end justify-between gap-2 h-48">
              {analyticsData.monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-indigo-100 rounded-t-lg transition-all duration-300"
                    style={{ height: `${(data.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                  >
                    <div 
                      className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg"
                      style={{ height: '100%' }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Breakdown</h3>
            <div className="space-y-4">
              {analyticsData.deviceBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.device}</span>
                    <span className="text-sm text-gray-500">{item.percentage}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-indigo-500' : index === 1 ? 'bg-purple-500' : 'bg-pink-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Subjects */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Subject Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Completion Rate</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {analyticsData.topSubjects.map((subject, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{subject.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{subject.questions.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-24">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${subject.completion}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{subject.completion}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">+{(Math.random() * 10).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
