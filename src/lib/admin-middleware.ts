// ============================================================================
// Admin Security Middleware (for API routes)
// ============================================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Check if the user has admin role in app_metadata
 * IMPORTANT: Uses app_metadata, NOT user_metadata (students cannot modify app_metadata)
 */
export function checkAdminRole(user: { app_metadata?: Record<string, any> | null }): boolean {
  return user?.app_metadata?.role === 'admin';
}

/**
 * Verify admin status server-side using Supabase Auth
 * Returns { isAdmin: boolean; userId?: string; error?: string }
 */
export async function verifyAdminStatus(request: Request): Promise<{ isAdmin: boolean; userId?: string; error?: string }> {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return { isAdmin: false, error: 'No access token provided' };
    }

    if (!supabaseAdmin) {
      return { isAdmin: false, error: 'Supabase admin client not configured' };
    }

    // Verify the token and get user
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return { isAdmin: false, error: 'Invalid or expired token' };
    }

    // Check app_metadata for admin role (NOT user_metadata)
    if (!checkAdminRole(user)) {
      return { isAdmin: false, userId: user.id, error: 'Access denied: Admin role required' };
    }

    return { isAdmin: true, userId: user.id };

  } catch (error) {
    console.error('Admin check error:', error);
    return { isAdmin: false, error: 'Failed to verify admin status' };
  }
}

/**
 * Middleware wrapper for API routes - call this at the start of your handler
 * Returns NextResponse if unauthorized, null if authorized
 */
export async function requireAdmin(request: Request): Promise<{ error: string; status: number } | null> {
  const result = await verifyAdminStatus(request);

  if (!result.isAdmin) {
    return { error: result.error || 'Unauthorized', status: 403 };
  }

  return null;
}

/**
 * Optional: Get user from request (for non-admin routes that need user ID)
 */
export async function getUserFromRequest(request: Request): Promise<{ userId: string | null; error?: string }> {
  try {
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return { userId: null, error: 'No access token provided' };
    }

    if (!supabaseAdmin) {
      return { userId: null, error: 'Supabase admin client not configured' };
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return { userId: null, error: 'Invalid token' };
    }

    return { userId: user.id };

  } catch (error) {
    return { userId: null, error: 'Failed to get user' };
  }
}
