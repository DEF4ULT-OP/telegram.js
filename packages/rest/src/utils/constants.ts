import { makeRequest } from '../strategies /axios';
import { RESTOptions, ResponseLike } from './types';

export enum RESTEvents {
  Debug = 'restDebug',
  RateLimited = 'rateLimited',
  Response = 'response',
  HandlerSweep = 'handlerSweep',
}

export const DefaultRestOptions = {
  agent: null,
  api: 'https://api.telegram.org',
  headers: {},
  invalidRequestWarningInterval: 0,
  globalRequestsPerSecond: 50,
  retries: 3,
  timeout: 15_000,
  handlerSweepInterval: 3_600_000,
  async makeRequest(...args): Promise<ResponseLike> {
    return makeRequest(...args);
  },
} as const satisfies Required<RESTOptions>;
