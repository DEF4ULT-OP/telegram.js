import { Stream } from 'node:stream';
import { Buffer } from 'buffer';
import path from 'node:path';
import fs from 'node:fs/promises';

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
  data: Buffer | Uint8Array | boolean | number | string;
  contentType?: string;
}> => {
  if (Buffer.isBuffer(resource)) return { data: resource };

  if (typeof resource === 'object' && Symbol.asyncIterator in resource) {
    return { data: await streamToBuffer(resource) };
  }

  if (typeof resource === 'string') {
    if (/^https?:\/\//.test(resource)) {
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

export const resolveBase64 = (data: any) => {
  if (Buffer.isBuffer(data))
    return `data:image/jpg;base64,${data.toString('base64')}`;
  return data;
};

export const resolveImage = async (image: BufferResolvable) => {
  if (!image) return null;
  if (typeof image === 'string' && image.startsWith('data:')) {
    return image;
  }

  const file = await resolveFile(image);
  return resolveBase64(file.data);
};
