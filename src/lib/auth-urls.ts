// Auth callback URL helper
export const getAuthCallbackUrl = (lang: 'id' | 'en' = 'id') => {
  const url = `${window.location.origin}/${lang}/auth/callback`;
  console.log("[AUTH URLS] Generated callback URL:", url);
  return url;
};

export const AUTH_CALLBACK_URL = getAuthCallbackUrl();
