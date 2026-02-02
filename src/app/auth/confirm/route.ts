import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(new URL('/signin?error=auth_config_error', request.url));
    }

    // Create a server client with cookies to properly persist the session
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set(name, value);
          const response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          request.cookies.set(name, '');
          const response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful exchange - redirect to the intended destination
      const redirectUrl = new URL(next, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    console.error('Error exchanging code for session:', error.message);
  }

  // If no code or error occurred, redirect to signin with error
  return NextResponse.redirect(new URL('/signin?error=auth_callback_error', request.url));
}
