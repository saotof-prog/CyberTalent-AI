export function cacheHeaders(ttlSeconds = 60, swrSeconds = 300): HeadersInit {
  return {
    "Cache-Control": `public, s-maxage=${ttlSeconds}, stale-while-revalidate=${swrSeconds}`,
  };
}

export function noCacheHeaders(): HeadersInit {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  };
}
