type CacheEntry<T> = { value: T; expiresAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __serverCache: Map<string, CacheEntry<unknown>> | undefined;
}

const cache: Map<string, CacheEntry<unknown>> =
  global.__serverCache ?? new Map<string, CacheEntry<unknown>>();

if (!global.__serverCache) global.__serverCache = cache;

export function cacheGet<T>(key: string): T | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    cache.delete(key);
    return null;
  }
  return hit.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

