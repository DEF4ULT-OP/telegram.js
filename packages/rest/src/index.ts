import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import { DefaultRestOptions, RESTEvents } from './utils/constants';
import { Agent } from 'node:https';
import { Collection } from '@telegramjs/collection';
import {
  AuthData,
  IHandler,
  InternalRequest,
  RequestData,
  RequestMethod,
  ResponseLike,
  RESTOptions,
  RouteLike,
} from './utils/types';

/**
 * Represents the class that manages handlers for endpoints
 */
export class REST extends AsyncEventEmitter<RESTEvents> {
  /**
   * The {@link https://undici.nodejs.org/#/docs/api/Agent | Agent} for all requests
   * performed by this manager.
   */
  public agent: Agent | null = null;

  /**
   * The number of requests remaining in the global bucket
   */
  public globalRemaining: number;

  /**
   * The promise used to wait out the global rate limit
   */
  public globalDelay: Promise<void> | null = null;

  /**
   * The timestamp at which the global bucket resets
   */
  public globalReset = -1;

  /**
   * Request handlers created from the bucket hash and the major parameters
   */
  public readonly handlers = new Collection<string, IHandler>();

  #token: string | null = null;

  private handlerTimer!: NodeJS.Timer | number;

  public readonly options: RESTOptions;

  public constructor(options: Partial<RESTOptions> = {}) {
    super();
    this.options = { ...DefaultRestOptions, ...options };
    this.globalRemaining = Math.max(1, this.options.globalRequestsPerSecond);
    this.agent = options.agent ?? null;

    this.setupSweepers();
  }

  setupSweepers() {
    if (
      this.options.handlerSweepInterval !== 0 &&
      this.options.handlerSweepInterval !== Number.POSITIVE_INFINITY
    ) {
      this.handlerTimer = setInterval(() => {
        const sweptHandlers = new Collection<string, IHandler>();

        this.handlers.sweep((val, key) => {
          const { inactive } = val;

          // Collect inactive handlers
          if (inactive) {
            sweptHandlers.set(key, val);
            this.emit(
              RESTEvents.Debug,
              `Handler ${val.id} for ${key} swept due to being inactive`
            );
          }

          return inactive;
        });

        // Fire event
        this.emit(RESTEvents.HandlerSweep, sweptHandlers);
      }, this.options.handlerSweepInterval);

      this.handlerTimer.unref?.();
    }
  }

  /**
   * Runs a get request from the api
   *
   * @param fullRoute - The full route to query
   * @param options - Optional request options
   */
  public async get(fullRoute: RouteLike, options: RequestData = {}) {
    return this.request({ ...options, fullRoute, method: RequestMethod.Get });
  }

  /**
   * Runs a request from the api
   *
   * @param options - Request options
   */
  public async request(options: InternalRequest) {
    const response = await this.queueRequest(options);
    return parseResponse(response);
  }

  /**
   * Queues a request to be sent
   *
   * @param request - All the information needed to make a request
   * @returns The response from the api request
   */
  public async queueRequest(request: InternalRequest): Promise<ResponseLike> {
    const customAuth =
      typeof request.auth === 'object' && request.auth.token !== this.#token;
    const auth = customAuth
      ? (request.auth as AuthData).token
      : request.auth !== false;

    const handler =
      this.handlers.get(`${hash.value}:${routeId.majorParameter}`) ??
      this.createHandler(hash.value, routeId.majorParameter);

    // Resolve the request into usable fetch options
    const { url, fetchOptions } = await this.resolveRequest(request);

    // Queue the request
    return handler.queueRequest(url, fetchOptions, {
      body: request.body,
      files: request.files,
      auth,
      signal: request.signal,
    });
  }
}
