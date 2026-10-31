/** Map untrusted query errors to fixed, translated notices. Never echo URL error text. */
export function signInErrorMessage(error: string | null): 'signInUnavailable' | 'accountLinkRequired' | 'googleDenied' | 'googleError' | 'signInError' | null {
  if (!error) return null;
  if (error === 'Configuration' || error === 'MissingSecret') return 'signInUnavailable';
  if (error === 'OAuthAccountNotLinked') return 'accountLinkRequired';
  if (error === 'AccessDenied') return 'googleDenied';
  if (['OAuthSignin', 'OAuthCallback', 'OAuthCallbackError', 'OAuthSigninError', 'Callback'].includes(error)) return 'googleError';
  return 'signInError';
}
