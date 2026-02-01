// Supabase client configuration
// Note: For full type safety, run: npx supabase gen types types > src/generated/supabase/database.types.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Simple client helper (import createClient from @supabase/supabase-js in your components)
export const getSupabaseConfig = () => ({
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  serviceKey: supabaseServiceKey,
});

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Export environment variables for use in components
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
};

// Mock Supabase client for development when not configured
export const createMockSupabaseClient = () => ({
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Mock client - no data' } }),
        then: (cb: any) => cb({ data: [], error: null }),
      }),
      then: (cb: any) => cb({ data: [], error: null }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Mock client' } }),
      }),
    }),
    update: (data: any) => ({
      eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null }) }) }),
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: null }),
    }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    getUser: () => Promise.resolve({ data: { user: null } }),
  },
});
