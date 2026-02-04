import { joinUrl } from "./url";

// Auth callback URL helper
export const getAuthCallbackUrl = (lang: 'id' | 'en' = 'id') => {
  // Use window.location.origin for reliable callback URL
  const appUrl = typeof window !== 'undefined' ? window.location.origin : import.meta.env.VITE_APP_URL;
  const callbackPath = `${lang}/auth/callback`;
  const url = joinUrl(appUrl, callbackPath);
  return url;
};

export const AUTH_CALLBACK_URL = getAuthCallbackUrl();
