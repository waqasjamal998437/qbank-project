"use client";

import { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Palette, 
  Globe,
  Mail,
  Save,
  Key,
  Building
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Building },
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="p-6 lg:p-8 min-h-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-500">Manage your admin account and platform settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-fit">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "general" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                    <input
                      type="text"
                      defaultValue="MedQBank"
                      className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                    <input
                      type="email"
                      defaultValue="support@medqbank.com"
                      className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+5 (PKT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
                    <select className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white font-medium rounded-xl hover:bg-indigo-600 transition-colors">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
                
                <div className="flex items-center gap-6">
                  <img
                    src="https://i.pravatar.cc/150?img=8"
                    alt="Admin"
                    className="w-20 h-20 rounded-full"
                  />
                  <div>
                    <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors">
                      Change Photo
                    </button>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Dr. Admin"
                      className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue="admin@medqbank.com"
                      className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      defaultValue="Super Admin"
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      defaultValue="Administration"
                      className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white font-medium rounded-xl hover:bg-indigo-600 transition-colors">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Password</p>
                          <p className="text-xs text-gray-500">Last changed 30 days ago</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                        Change Password
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-xs text-gray-500">Add an extra layer of security</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Login Sessions</p>
                          <p className="text-xs text-gray-500">Manage your active sessions</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                        View Sessions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {[
                    { label: "New student registrations", description: "Get notified when a new student signs up" },
                    { label: "Subscription updates", description: "Receive alerts for subscription changes" },
                    { label: "Question reports", description: "Get notified about flagged questions" },
                    { label: "System updates", description: "Receive important platform announcements" },
                    { label: "Weekly digest", description: "Get a weekly summary of platform activity" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white font-medium rounded-xl hover:bg-indigo-600 transition-colors">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Billing & Subscription</h2>
                
                <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl text-white">
                  <p className="text-sm opacity-80 mb-1">Current Plan</p>
                  <p className="text-3xl font-bold mb-4">Enterprise</p>
                  <p className="text-sm opacity-80">Unlimited access to all features</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-gray-900">$125,840</p>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-gray-900">$14,234</p>
                    <p className="text-sm text-gray-500">This Month</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-gray-900">$847</p>
                    <p className="text-sm text-gray-500">Avg. Per User</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white font-medium rounded-xl hover:bg-indigo-600 transition-colors">
                    <CreditCard className="w-4 h-4" />
                    Manage Subscription
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
