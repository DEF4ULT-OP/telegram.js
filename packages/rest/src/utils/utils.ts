/**
 * Sleeps for a given amount of time.
 *
 * @param ms - The amount of time (in milliseconds) to sleep for
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

/**
 * Check whether an error indicates that a retry can be attempted
 *
 * @param error - The error thrown by the network request
 * @returns Whether the error indicates a retry should be attempted
 */
export function shouldRetry(error: Error | NodeJS.ErrnoException) {
  // Retry for possible timed out requests
  if (error.name === 'AbortError') return true;
  // Downlevel ECONNRESET to retry as it may be recoverable
  return (
    ('code' in error && error.code === 'ECONNRESET') ||
    error.message.includes('ECONNRESET')
  );
}

export function isBufferLike(
  value: unknown
): value is ArrayBuffer | Buffer | Uint8Array | Uint8ClampedArray {
  return (
    value instanceof ArrayBuffer ||
    value instanceof Uint8Array ||
    value instanceof Uint8ClampedArray
  );
}

/**
 * Normalizes the offset for rate limits. Applies a Math.max(0, N) to prevent negative offsets,
 * also deals with callbacks.
 *
 * @internal
 */
export function normalizeRateLimitOffset(offset: number): number {
  return Math.max(0, offset);
}
