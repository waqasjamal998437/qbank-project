"use client";

import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, SunMoon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTheme();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  }, [toggleTheme]);

  // Prevent hydration mismatch - show placeholder during SSR
  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-[100]">
        <button
          className="p-3 rounded-full bg-slate-200 shadow-sm"
          aria-hidden="true"
        >
          <SunMoon className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={handleToggle}
      className={`fixed top-4 right-4 z-[100] p-3 rounded-full shadow-lg transition-all duration-300 ${
        isDark 
          ? "bg-zinc-800 hover:bg-zinc-700 text-amber-400 ring-1 ring-zinc-700" 
          : "bg-slate-100 hover:bg-slate-200 text-slate-700 ring-1 ring-slate-200"
      }`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div
        className={`transform transition-transform duration-300 ease-out ${
          isAnimating ? 'rotate-90 scale-110' : ''
        }`}
        style={{ 
          transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </div>
    </button>
  );
}
