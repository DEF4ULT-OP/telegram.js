import https from 'node:https';
import { makeRequest } from '../strategies/axios.js';
import { RESTOptions, ResponseLike } from './types.js';

export const DefaultUserAgent = `TelegramBot (https://telegram.js.org)`;

export enum RESTEvents {
  Debug = 'restDebug',
  RateLimited = 'rateLimited',
  Response = 'response',
  HandlerSweep = 'handlerSweep',
  InvalidRequestWarning = 'invalidRequestWarning',
}

const httpsAgent = new https.Agent({ family: 4, keepAlive: true });

export const DefaultRestOptions = {
  api: 'https://api.telegram.org',
  headers: {},
  retries: 3,
  timeout: 30_000,
  agent: httpsAgent,
  invalidRequestWarningInterval: 0,
  globalRequestsPerSecond: 50,
  offset: 50,
  handlerSweepInterval: 3_600_000,
  async makeRequest(...args): Promise<ResponseLike> {
    return makeRequest(...args);
  },
} as const satisfies Required<RESTOptions>;
