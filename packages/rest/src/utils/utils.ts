import { BufferResolvable, resolveFileIdOrFile } from '@telegramjs/util';
import { RequestData } from './types.js';

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

export interface PrepareMediaRequestOptions {
  body: Record<string, any>;
  files: {
    name: string;
    field: string;
    file?: BufferResolvable;
    fileKey?: string;
    download?: boolean;
  }[];
}

export const prepareMediaRequest = async ({
  body,
  files,
}: PrepareMediaRequestOptions): Promise<RequestData> => {
  const options: RequestData = {
    body,
    files: [],
  };

  for (const file of files) {
    const fileData = file.file || (body[file.field] as BufferResolvable);

    if (fileData) {
      const resolvedFile = await resolveFileIdOrFile(
        fileData,
        file.download ?? false
      );

      if (typeof resolvedFile === 'string') {
        options.body![file.field as string] = resolvedFile;
      } else {
        options.files?.push({
          name: file.name,
          key: file.fileKey || file.field,
          ...resolvedFile,
        });

        delete options.body![file.field as string];
      }
    }
  }

  return options;
};
