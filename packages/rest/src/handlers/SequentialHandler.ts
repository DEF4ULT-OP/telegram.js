import { AsyncQueue } from '@sapphire/async-queue';
import type { REST } from '../REST.js';
import { RESTEvents } from '../utils/constants.js';
import type { ResponseLike, HandlerRequestData } from '../utils/types.js';
import { sleep } from '../utils/utils.js';
import {
  handleErrors,
  IHandler,
  incrementInvalidCount,
  makeNetworkRequest,
} from './Common.js';
import { AxiosRequestConfig } from 'axios';

/**
 * The structure used to handle sequential requests for global rate limits
 */
export class SequentialHandler implements IHandler {
  /**
   * {@inheritDoc IHandler.id}
   */
  public readonly id: string;

  /**
   * The queue used to handle sequential requests
   */
  #asyncQueue = new AsyncQueue();

  /**
   * @param manager - The request manager
   */
  public constructor(
    private readonly manager: REST,
    private readonly hash: string
  ) {
    this.id = `${this.hash}`;
  }

  public get inactive(): boolean {
    return this.#asyncQueue.remaining === 0;
  }
  /**
   * Gets the global request limit from the manager
   */
  private get globalRequestsPerSecond(): number {
    return this.manager.options.globalRequestsPerSecond;
  }

  /**
   * If the global rate limit is currently active
   */
  private get globalLimited(): boolean {
    return (
      this.manager.globalRemaining <= 0 && Date.now() < this.manager.globalReset
    );
  }

  /**
   * Emits a debug message
   *
   * @param message - The message to debug
   */
  private debug(message: string): void {
    this.manager.emit(RESTEvents.Debug, `[REST Global] ${message}`);
  }

  /**
   * Delays all requests for the specified amount of time, handling global rate limits
   *
   * @param time - The amount of time to delay all requests for
   */
  private async globalDelayFor(time: number): Promise<void> {
    this.debug(`Delaying all requests for ${time}ms due to global rate limit.`);
    await sleep(time);
    this.manager.globalDelay = null;
  }

  /**
   * Queues a request to be executed respecting the global rate limit
   *
   * @param url - The URL to send the request to
   * @param options - The fetch options
   * @param requestData - Extra data for the request
   */
  public async queueRequest(
    url: string,
    options: AxiosRequestConfig,
    requestData: HandlerRequestData
  ): Promise<ResponseLike> {
    // Wait for the queue to be free
    await this.#asyncQueue.wait({ signal: requestData.signal });

    try {
      return await this.runRequest(url, options, requestData);
    } finally {
      // Release the queue for the next request
      this.#asyncQueue.shift();
    }
  }

  private async runRequest(
    url: string,
    options: AxiosRequestConfig,
    requestData: HandlerRequestData,
    retries = 0
  ): Promise<ResponseLike> {
    while (this.globalLimited) {
      const timeout =
        this.manager.globalReset + this.manager.options.offset - Date.now();

      this.debug(`Global rate limit hit. Blocking requests for ${timeout}ms.`);
      await this.globalDelayFor(timeout);
    }

    // As the request goes out, update global usage
    if (!this.manager.globalReset || this.manager.globalReset < Date.now()) {
      this.manager.globalReset = Date.now() + 1_000; // Reset global limit every second
      this.manager.globalRemaining = this.globalRequestsPerSecond;
    }

    this.manager.globalRemaining--;

    const res = await makeNetworkRequest(
      this.manager,
      url,
      options,
      requestData,
      retries
    );

    if (res === null) {
      return this.runRequest(url, options, requestData, ++retries);
    }

    const status = res.status;
    const method = options.method ?? 'get';
    const retryAfter = (res.body as any).parameters?.retry_after || 0;

    if (status === 401 || status === 403 || status === 429) {
      incrementInvalidCount(this.manager);
    }

    if (res.status < 300) {
      return res;
    } else if (res.status === 429) {
      this.manager.globalRemaining = 0;
      this.manager.globalReset = Date.now() + retryAfter;

      this.debug(
        [
          'Encountered unexpected 429 rate limit',
          `  Global         : ${this.globalLimited.toString()}`,
          `  Method         : ${method}`,
          `  URL            : ${url}`,
          `  Retry After    : ${retryAfter}ms`,
        ].join('\n')
      );

      return this.runRequest(url, options, requestData, retries);
    } else {
      const handled = await handleErrors(
        this.manager,
        res,
        method,
        url,
        requestData,
        retries
      );

      if (handled === null) {
        return this.runRequest(url, options, requestData, retries);
      }

      return handled;
    }
  }
}
