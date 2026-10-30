export interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: (code?: string) => void;
  'expired-callback'?: () => void;
  'timeout-callback'?: () => void;
  'unsupported-callback'?: () => void;
  'before-interactive-callback'?: () => void;
  'after-interactive-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  appearance?: 'always';
  execution?: 'render';
  language?: string;
}
export interface TurnstileAPI {
  ready?: (callback: () => void) => void;
  render: (container: string | HTMLElement, options: TurnstileOptions) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
}
declare global { interface Window { turnstile?: TurnstileAPI } }
let pending: Promise<TurnstileAPI> | null = null;

/** Share the asynchronous script across SPA mounts. Do not call ready() on async scripts. */
export function loadTurnstile(): Promise<TurnstileAPI> {
  if (pending) return pending;
  pending = new Promise<TurnstileAPI>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
    let settled = false;
    const finish = (error?: string) => {
      if (settled) return;
      const api = window.turnstile;
      if (!error && !api?.render) return;
      const cleanup = () => {
        clearInterval(poll); clearTimeout(timeout);
        script?.removeEventListener('error', onError); script?.removeEventListener('load', onLoad);
      };
      settled = true; cleanup();
      if (error) { script?.remove(); reject(new Error(error)); }
      else resolve(api!);
    };
    const onError = () => finish('script-load-failed');
    const onLoad = () => finish();
    const poll = window.setInterval(() => finish(), 100);
    const timeout = window.setTimeout(() => finish('script-load-timeout'), 15000);
    if (!script && !window.turnstile?.render) {
      script = document.createElement('script');
      script.id = 'cloudflare-turnstile';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.addEventListener('error', onError);
      script.addEventListener('load', onLoad);
      document.head.appendChild(script);
    } else { script?.addEventListener('error', onError); script?.addEventListener('load', onLoad); }
  }).catch(error => { pending = null; throw error; });
  return pending;
}
