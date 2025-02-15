import { Stream } from 'node:stream';
import { Buffer } from 'buffer';
import path from 'node:path';
import fs from 'node:fs/promises';
import { isValidUrl } from './util.js';

export type BufferResolvable = Buffer | string | AsyncIterable<Uint8Array>;

export type Base64Resolvable = Buffer | string;

export const streamToBuffer = async (
  stream: AsyncIterable<Uint8Array>
): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

export const resolveFile = async (
  resource: BufferResolvable | Stream
): Promise<{
  data: Buffer;
  contentType?: string;
}> => {
  if (Buffer.isBuffer(resource)) return { data: resource };

  if (typeof resource === 'object' && Symbol.asyncIterator in resource) {
    return { data: await streamToBuffer(resource) };
  }

  if (typeof resource === 'string') {
    if (isValidUrl(resource)) {
      const res = await fetch(resource);

      return {
        data: Buffer.from(await res.arrayBuffer()),
        contentType: res.headers.get('content-type') || '',
      };
    }

    const filePath = path.resolve(resource);
    const stats = await fs.stat(filePath);
    if (!stats.isFile())
      throw new Error(`File could not be found: ${filePath}`);

    return { data: await fs.readFile(filePath) };
  }

  throw new Error(
    'The resource must be a string, Buffer or a valid file stream.'
  );
};

export const resolveBase64 = (data: Base64Resolvable): string => {
  if (Buffer.isBuffer(data))
    return `data:image/jpg;base64,${data.toString('base64')}`;
  return data;
};

export const resolveImage = async (
  image: BufferResolvable | Base64Resolvable
) => {
  if (!image) throw new Error('No image provided.');
  if (typeof image === 'string' && image.startsWith('data:')) {
    return image;
  }

  const file = await resolveFile(image);
  return file.data as any;
  // return resolveBase64(file.data);
};

export const isFileId = (input: string) => {
  const fileIdRegex = /^[A-Za-z0-9_-]{20,}$/;
  if (fileIdRegex.test(input)) {
    return true;
  }

  return false;
};

export const resolveFileIdOrFile = async (
  resource: BufferResolvable | Stream
) => {
  if (
    typeof resource === 'string' &&
    (isFileId(resource) || isValidUrl(resource))
  ) {
    return resource;
  }

  return resolveFile(resource);
};
