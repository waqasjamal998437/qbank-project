import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from '@supabase/ssr';

// Initialize Supabase clients for middleware
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Check if user has admin role in app_metadata
 * IMPORTANT: Uses app_metadata, NOT user_metadata
 */
function isAdmin(user: { app_metadata?: Record<string, unknown> | null }): boolean {
  return user?.app_metadata?.role === 'admin';
}

/**
 * Check if user is authenticated (has valid session)
 */
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        request.cookies.set(name, value);
      },
      remove(name: string, options: any) {
        request.cookies.set(name, '');
      },
    },
  });
  
  const { data: { session }, error } = await supabase.auth.getSession();
  return !error && !!session?.user;
}

/**
 * Check if user is authenticated and email is confirmed
 */
async function isAuthenticatedAndVerified(request: NextRequest): Promise<boolean> {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        request.cookies.set(name, value);
      },
      remove(name: string, options: any) {
        request.cookies.set(name, '');
      },
    },
  });
  
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session?.user) return false;
  
  // Check if email is confirmed via email_confirmed_at
  return session.user.email_confirmed_at != null;
}

/**
 * Check if user is admin
 */
async function isAuthenticatedAdmin(request: NextRequest): Promise<boolean> {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        request.cookies.set(name, value);
      },
      remove(name: string, options: any) {
        request.cookies.set(name, '');
      },
    },
  });
  
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session?.user) return false;
  return isAdmin(session.user);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ========================================
  // 0. Skip auth checks for auth callback and verify-otp routes
  // ========================================
  if (pathname === "/auth/callback" || pathname === "/auth/confirm" || pathname === "/verify-otp") {
    return response;
  }

  // ========================================
  // 1. Protect /admin routes (full admin panel)
  // ========================================
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!supabaseUrl || !supabaseAnonKey) {
      // Supabase not configured, redirect to login
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isAdminUser = await isAuthenticatedAdmin(request);

    if (!isAdminUser) {
      // Not logged in or not admin - redirect based on auth status
      const isAuth = await isAuthenticated(request);
      if (!isAuth) {
        // Not logged in at all, redirect to admin login
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // Logged in but not admin - redirect to dashboard with error
      const dashboardUrl = new URL("/dashboard", request.url);
      dashboardUrl.searchParams.set("error", "unauthorized");
      dashboardUrl.searchParams.set("message", "You do not have permission to access the admin area");
      return NextResponse.redirect(dashboardUrl);
    }

    // Admin authenticated - allow access
    return response;
  }

  // ========================================
  // 2. Handle /admin/login special case
  // ========================================
  if (pathname === "/admin/login") {
    if (supabaseUrl && supabaseAnonKey) {
      const isAdminUser = await isAuthenticatedAdmin(request);
      if (isAdminUser) {
        // Already authenticated as admin, redirect to admin dashboard
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
    return response;
  }

  // ========================================
  // 3. Handle /login special case (prevent infinite redirect)
  // ========================================
  if (pathname === "/login") {
    if (supabaseUrl && supabaseAnonKey) {
      const isAuth = await isAuthenticated(request);
      if (isAuth) {
        // Already authenticated, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return response;
  }

  // ========================================
  // 4. Protect /dashboard and /profile routes
  // ========================================
  if (pathname === "/dashboard" || pathname === "/profile") {
    if (!supabaseUrl || !supabaseAnonKey) {
      // Supabase not configured, redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isAuth = await isAuthenticated(request);

    if (!isAuth) {
      // Not logged in, redirect to user login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is verified (email confirmed)
    const isVerified = await isAuthenticatedAndVerified(request);
    
    if (!isVerified) {
      // User is authenticated but email not confirmed - redirect to verify page
      // Get email from session for the redirect
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set(name, value);
          },
          remove(name: string, options: any) {
            request.cookies.set(name, '');
          },
        },
      });
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email || '';
      const verifyUrl = new URL("/verify-otp", request.url);
      if (email) {
        verifyUrl.searchParams.set("email", email);
      }
      return NextResponse.redirect(verifyUrl);
    }

    return response;
  }

  return response;
}

export const config = {
  matcher: [
    // Allow auth callback routes
    "/auth/callback",
    "/auth/confirm",
    // Protect admin routes
    "/admin/:path*",
    // Protect dashboard and profile routes
    "/dashboard",
    "/profile",
    // Also protect login to prevent infinite redirects
    "/login",
  ],
};
