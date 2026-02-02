/**
 * Get the base URL for the application
 * Handles NEXT_PUBLIC_SITE_URL environment variable with proper formatting
 * Falls back to localhost:3000 for local development
 */
export function getURL(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return 'http://localhost:3000';
  }

  // Remove trailing slashes
  const cleanedUrl = siteUrl.replace(/\/+$/, '');

  // Add protocol if missing
  if (!cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
    // Detect if we're in production (usually has .vercel.app, .cloudflareapps.com, etc.)
    const isProduction = process.env.NODE_ENV === 'production';
    return isProduction ? `https://${cleanedUrl}` : `http://${cleanedUrl}`;
  }

  return cleanedUrl;
}

/**
 * Get the auth confirm URL for email redirects
 */
export function getAuthConfirmURL(): string {
  return `${getURL()}/auth/confirm`;
}
