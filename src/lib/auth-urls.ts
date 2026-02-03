import { joinUrl } from "./url";

// Auth callback URL helper
export const getAuthCallbackUrl = (lang: 'id' | 'en' = 'id') => {
  const appUrl = import.meta.env.VITE_APP_URL;
  const callbackPath = `${lang}/auth/callback`;
  const url = joinUrl(appUrl, callbackPath);
  console.log("[AUTH URLS] Generated callback URL:", url);
  return url;
};

export const AUTH_CALLBACK_URL = getAuthCallbackUrl();
