// Auth callback URL helper
export const getAuthCallbackUrl = (lang: 'id' | 'en' = 'id') => {
  return `${window.location.origin}/${lang}/auth/callback`;
};

export const AUTH_CALLBACK_URL = getAuthCallbackUrl();
