"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, BarChart2, Settings, Menu, X, Layers, Library, LayoutDashboard, ClipboardList } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileSection } from "./AdminStatusBadge";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/study", icon: BookOpen, label: "Study" },
    { href: "/flashcards", icon: Layers, label: "Flashcards" },
    { href: "/library", icon: Library, label: "Library" },
    { href: "/exam-sim", icon: ClipboardList, label: "Exam Simulation" },
    { href: "/stats", icon: BarChart2, label: "Stats" },
    { href: "/admin", icon: LayoutDashboard, label: "Admin" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <ThemeToggle />
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Glassmorphism Design */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 
          bg-white/80 backdrop-blur-md border-r border-white/20
          shadow-[0_8px_30px_rgb(0,0,0,0.04)]
          transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Top: Logo */}
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Qbank</h1>
              <p className="text-xs text-slate-500 mt-0.5">v1.0</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Middle: Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Handle root path "/" as active for dashboard
            const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium border border-blue-100"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-transparent"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: User Profile */}
        <div className="p-4 border-t border-slate-200/50">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
            <ProfileSection username="Jamal" email="jamal@example.com" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200/50 p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-slate-800">Qbank</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
