import { AxiosRequestConfig } from 'axios';
import { HTTPError } from '../errors/HTTPError.js';
import {
  TelegramAPIError,
  TelegramAPIErrorData,
} from '../errors/TelegramAPIError.js';
import { REST } from '../REST.js';
import { RESTEvents } from '../utils/constants.js';
import { HandlerRequestData, ResponseLike } from '../utils/types.js';
import { shouldRetry } from '../utils/utils.js';

export interface IHandler {
  /**
   * The unique id of the handler
   */
  readonly id: string;
  /**
   * If the bucket is currently inactive (no pending requests)
   */
  get inactive(): boolean;
  /**
   * Queues a request to be sent
   *
   * @param url - The url to do the request on
   * @param options - All the information needed to make a request
   * @param requestData - Extra data from the user's request needed for errors and additional processing
   */
  queueRequest(
    url: string,
    options: AxiosRequestConfig,
    requestData: HandlerRequestData
  ): Promise<ResponseLike>;
}

/**
 * Invalid request limiting is done on a per-IP basis, not a per-token basis.
 * The best we can do is track invalid counts process-wide (on the theory that
 * users could have multiple bots run from one process) rather than per-bot.
 * Therefore, store these at file scope here rather than in the client's
 * RESTManager object.
 */
let invalidCount = 0;
let invalidCountResetTime: number | null = null;

/**
 * Increment the invalid request count and emit warning if necessary
 *
 * @internal
 */
export function incrementInvalidCount(manager: REST) {
  if (!invalidCountResetTime || invalidCountResetTime < Date.now()) {
    invalidCountResetTime = Date.now() + 1_000 * 60 * 10;
    invalidCount = 0;
  }

  invalidCount++;

  const emitInvalid =
    manager.options.invalidRequestWarningInterval > 0 &&
    invalidCount % manager.options.invalidRequestWarningInterval === 0;
  if (emitInvalid) {
    // Let library users know periodically about invalid requests
    manager.emit(RESTEvents.InvalidRequestWarning, {
      count: invalidCount,
      remainingTime: invalidCountResetTime - Date.now(),
    });
  }
}

/**
 * Performs the actual network request for a request handler
 *
 * @param manager - The manager that holds options and emits informational events
 * @param url - The fully resolved url to make the request to
 * @param options - The fetch options needed to make the request
 * @param requestData - Extra data from the user's request needed for errors and additional processing
 * @param retries - The number of retries this request has already attempted (recursion occurs on the handler)
 * @returns The respond from the network or `null` when the request should be retried
 * @internal
 */
export async function makeNetworkRequest(
  manager: REST,
  url: string,
  options: AxiosRequestConfig,
  requestData: HandlerRequestData,
  retries: number
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), manager.options.timeout);
  if (requestData.signal) {
    // If the user signal was aborted, abort the controller, else abort the local signal.
    // The reason why we don't re-use the user's signal, is because users may use the same signal for multiple
    // requests, and we do not want to cause unexpected side-effects.
    if (requestData.signal.aborted) controller.abort();
    else requestData.signal.addEventListener('abort', () => controller.abort());
  }

  let res: ResponseLike;
  try {
    res = await manager.options.makeRequest(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error: unknown) {
    if (!(error instanceof Error)) throw error;
    // Retry the specified number of times if needed
    if (shouldRetry(error) && retries !== manager.options.retries) {
      // Retry is handled by the handler upon receiving null
      return null;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (manager.listenerCount(RESTEvents.Response)) {
    manager.emit(
      RESTEvents.Response,
      {
        method: options.method ?? 'get',
        url,
        options,
        data: requestData,
        retries,
      },
      res instanceof Response ? res.clone() : { ...res }
    );
  }

  return res;
}

export async function handleErrors(
  manager: REST,
  res: ResponseLike,
  method: string,
  url: string,
  requestData: HandlerRequestData,
  retries: number
) {
  const status = res.status;
  if (status >= 500 && status < 600) {
    // Retry the specified number of times for possible server side issues
    if (retries !== manager.options.retries) {
      return null;
    }

    // We are out of retries, throw an error
    throw new HTTPError(status, res.statusText, method, url, requestData);
  } else {
    // Handle possible malformed requests
    if (status >= 400 && status < 500) {
      // If we receive this status code, it means the token we had is no longer valid.
      if (status === 401 && requestData.token) {
        manager.setToken(null!);
      }

      // The request will not succeed for some reason, parse the error returned from the api
      const data = res.body as unknown as TelegramAPIErrorData;
      // throw the API error
      throw new TelegramAPIError(
        data,
        'error_code' in data ? data.error_code : status,
        status,
        method,
        url,
        requestData
      );
    }

    return res;
  }
}
