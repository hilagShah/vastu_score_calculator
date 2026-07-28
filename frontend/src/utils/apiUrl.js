/**
 * Utility function to determine the backend API base URL.
 * Supports VITE_API_URL environment variable, or falls back to local port 5001
 * when running on a dev server, or relative paths when deployed live on Vercel.
 */
export const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const hostname = window.location.hostname || 'localhost';
  return window.location.port ? `${window.location.protocol}//${hostname}:5001` : '';
};
