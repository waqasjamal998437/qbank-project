"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for client-side use
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface AdminStatusBadgeProps {
  /** Optional: Custom className for styling overrides */
  className?: string;
}

/**
 * AdminStatusBadge Component
 * Displays an "ADMIN" badge if the current user has admin role in app_metadata.
 * Uses loading state to prevent flicker on page load.
 */
export function AdminStatusBadge({ className = "" }: AdminStatusBadgeProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkAdminStatus() {
      if (!supabase) {
        if (mounted) setIsAdmin(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (mounted) {
          const adminStatus = user?.app_metadata?.role === "admin";
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (mounted) setIsAdmin(false);
      }
    }

    checkAdminStatus();

    return () => {
      mounted = false;
    };
  }, []);

  // Show nothing while loading or if not admin
  if (isAdmin === null || !isAdmin) {
    return null;
  }

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold
        bg-[#6366F1] text-[#EEF2FF]
        border border-[#4F46E5]
        ${className}
      `}
      title="Administrator"
    >
      ADMIN
    </span>
  );
}

/**
 * ProfileSection Component
 * A complete profile section with username and admin badge.
 * Ready to replace the hardcoded profile section in Layout.
 */
export function ProfileSection({ 
  username = "User", 
  email = "",
  className = "" 
}: {
  username?: string;
  email?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 rounded-full bg-[var(--muted-bg-hover)] flex items-center justify-center border border-[var(--border)]">
        <svg
          className="w-5 h-5 text-[var(--foreground-secondary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-[var(--foreground)] truncate">
            {username}
          </p>
          <AdminStatusBadge />
        </div>
        {email && (
          <p className="text-xs text-[var(--foreground-secondary)] truncate">
            {email}
          </p>
        )}
      </div>
    </div>
  );
}
