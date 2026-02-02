// Auth callback URL helper
export const getAuthCallbackUrl = (lang: 'id' | 'en' = 'id') => {
  return `${window.location.origin}/${lang}/auth/callback-page`;
};

export const AUTH_CALLBACK_URL = getAuthCallbackUrl();
