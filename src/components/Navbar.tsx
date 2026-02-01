"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Activity } from "lucide-react";
import { cn } from "../lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="fixed top-0 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-indigo-500 dark:text-indigo-400">
          <Activity size={20} />
          <span>T3_APP</span>
        </div>
        
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-indigo-500 dark:hover:text-indigo-400",
                pathname === item.href ? "text-indigo-500 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"
              )}
            >
              <item.icon size={16} />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
