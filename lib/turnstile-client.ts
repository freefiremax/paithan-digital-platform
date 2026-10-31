export interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: (code?: string) => boolean | void;
  'expired-callback'?: () => void;
  'timeout-callback'?: () => void;
  'unsupported-callback'?: () => void;
  'before-interactive-callback'?: () => void;
  'after-interactive-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  'response-field'?: boolean;
  retry?: 'auto' | 'never';
  'retry-interval'?: number;
  'refresh-expired'?: 'auto' | 'manual' | 'never';
  'refresh-timeout'?: 'auto' | 'manual' | 'never';
  appearance?: 'always' | 'execute' | 'interaction-only';
  action?: string;
  cdata?: string;
  execution?: 'render' | 'execute';
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
let resolvedAPI: TurnstileAPI | null = null;

/** Share the asynchronous script across SPA mounts. Do not call ready() on async scripts. */
export function loadTurnstile(): Promise<TurnstileAPI> {
  if (pending && resolvedAPI && window.turnstile !== resolvedAPI) {
    pending = null; resolvedAPI = null;
    document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]')?.remove();
  }
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
      else { resolvedAPI = api!; resolve(api!); }
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
      script.fetchPriority = 'high';
      script.addEventListener('error', onError);
      script.addEventListener('load', onLoad);
      document.head.appendChild(script);
    } else { script?.addEventListener('error', onError); script?.addEventListener('load', onLoad); }
    finish();
  }).catch(error => { pending = null; throw error; });
  return pending;
}

/** Retry temporary provider/network failures, never invalid keys or hostnames. */
export function isRetryableTurnstileError(code: string): boolean {
  return ['script-load-failed', 'script-load-timeout', 'render-failed', 'challenge-timeout', 'network-error', '110600', '110620', '200500'].includes(code)
    || /^(300|600)\d{3}$/.test(code);
}
