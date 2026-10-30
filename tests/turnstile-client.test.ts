import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TurnstileAPI } from '@/lib/turnstile-client';

beforeEach(() => { vi.resetModules(); vi.useFakeTimers(); });
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); vi.unstubAllGlobals(); });
function environment(api?: Partial<TurnstileAPI>) {
  const listeners = new Map<string, () => void>();
  const script = { id: '', src: '', async: false, addEventListener: (name: string, callback: () => void) => listeners.set(name, callback), removeEventListener: (name: string) => listeners.delete(name), remove: vi.fn() };
  const append = vi.fn();
  vi.stubGlobal('window', { turnstile: api, setInterval, setTimeout });
  vi.stubGlobal('document', { querySelector: () => null, createElement: () => script, head: { appendChild: append } });
  return { listeners, script, append };
}
describe('Turnstile SPA loader', () => {
  it('shares one script promise across concurrent widgets', async () => {
    const env = environment();
    const { loadTurnstile } = await import('@/lib/turnstile-client');
    const first = loadTurnstile();
    expect(loadTurnstile()).toBe(first);
    expect(env.append).toHaveBeenCalledTimes(1);
    const api = { render: vi.fn(), ready: (callback: () => void) => callback(), remove: vi.fn(), reset: vi.fn() };
    window.turnstile = api;
    await vi.advanceTimersByTimeAsync(100);
    expect(await first).toBe(api);
  });
  it('fails if the API never becomes ready', async () => {
    environment({ render: vi.fn(), ready: vi.fn() });
    const { loadTurnstile } = await import('@/lib/turnstile-client');
    const promise = loadTurnstile();
    const rejected = expect(promise).rejects.toThrow('script-load-timeout');
    await vi.advanceTimersByTimeAsync(15000);
    await rejected;
  });
  it('clears a failed script so a retry can load it again', async () => {
    const env = environment();
    const { loadTurnstile } = await import('@/lib/turnstile-client');
    const first = loadTurnstile();
    const rejected = expect(first).rejects.toThrow('script-load-failed');
    env.listeners.get('error')!();
    await rejected;
    expect(env.script.remove).toHaveBeenCalled();
    const retry = loadTurnstile();
    expect(env.append).toHaveBeenCalledTimes(2);
    window.turnstile = { render: vi.fn(), remove: vi.fn(), reset: vi.fn() };
    await vi.advanceTimersByTimeAsync(100);
    await retry;
  });
});
