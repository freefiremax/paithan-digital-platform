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

/** A single script for all SPA mounts; wait for the API, not just a script tag. */
export function loadTurnstile(): Promise<TurnstileAPI> {
  if (pending) return pending;
  pending = new Promise<TurnstileAPI>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
    let settled = false;
    let readyRequested = false;
    const finish = (error?: string) => {
      if (settled) return;
      const api = window.turnstile;
      if (!error && !api?.render) return;
      const cleanup = () => { clearInterval(poll); clearTimeout(timeout); script?.removeEventListener('error', onError); };
      if (error) { settled = true; cleanup(); script?.remove(); reject(new Error(error)); return; }
      if (readyRequested) return;
      readyRequested = true;
      const ready = () => { if (settled) return; settled = true; cleanup(); resolve(api!); };
      if (api!.ready) api!.ready(ready); else ready();
    };
    const onError = () => finish('script-load-failed');
    const poll = window.setInterval(() => finish(), 100);
    const timeout = window.setTimeout(() => finish('script-load-timeout'), 15000);
    if (!script && !window.turnstile?.render) {
      script = document.createElement('script');
      script.id = 'cloudflare-turnstile';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.addEventListener('error', onError);
      document.head.appendChild(script);
    } else script?.addEventListener('error', onError);
  }).catch(error => { pending = null; throw error; });
  return pending;
}
