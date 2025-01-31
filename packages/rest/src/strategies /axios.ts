import { types } from 'node:util';
import { ResponseLike } from '../utils/types';
import axios, { AxiosRequestConfig } from 'axios';

export async function makeRequest(
  url: string,
  init: any
): Promise<ResponseLike> {
  const options = {
    ...init,
    url,
    body: await resolveBody(init.body),
  } as AxiosRequestConfig;

  const res = await axios(options);

  return {
    body: res.data,
    headers: res.headers,
    status: res.status,
    statusText: res.statusText,
  };
}

export async function resolveBody(
  body: RequestInit['body']
): Promise<Exclude<AxiosRequestConfig['data'], undefined>> {
  // eslint-disable-next-line no-eq-null, eqeqeq
  if (body == null) {
    return null;
  } else if (typeof body === 'string') {
    return body;
  } else if (types.isUint8Array(body)) {
    return body;
  } else if (types.isArrayBuffer(body)) {
    return new Uint8Array(body);
  } else if (body instanceof URLSearchParams) {
    return body.toString();
  } else if (body instanceof DataView) {
    return new Uint8Array(body.buffer);
  } else if (body instanceof Blob) {
    return new Uint8Array(await body.arrayBuffer());
  } else if (body instanceof FormData) {
    return body;
  } else if ((body as Iterable<Uint8Array>)[Symbol.iterator]) {
    const chunks = [...(body as Iterable<Uint8Array>)];

    return Buffer.concat(chunks);
  } else if ((body as AsyncIterable<Uint8Array>)[Symbol.asyncIterator]) {
    const chunks: Uint8Array[] = [];

    for await (const chunk of body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  throw new TypeError(`Unable to resolve body.`);
}
