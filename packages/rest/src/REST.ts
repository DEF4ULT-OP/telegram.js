import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import {
  DefaultRestOptions,
  DefaultUserAgent,
  RESTEvents,
} from './utils/constants.js';
import { Agent } from 'node:https';
import { Collection } from '@telegramjs/collection';
import {
  IHandler,
  InternalRequest,
  RequestData,
  RequestHeaders,
  RequestMethod,
  ResponseLike,
  RESTOptions,
  RouteLike,
} from './utils/types.js';
import { AxiosRequestConfig } from 'axios';
import { filetypeinfo } from 'magic-bytes.js';
import { isBufferLike } from './utils/utils.js';
import qs from 'querystring';
import { SequentialHandler } from './handlers/SequentialHandler.js';

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
   * Runs a delete request from the api
   *
   * @param fullRoute - The full route to query
   * @param options - Optional request options
   */
  public async delete(fullRoute: RouteLike, options: RequestData = {}) {
    return this.request({
      ...options,
      fullRoute,
      method: RequestMethod.Delete,
    });
  }

  /**
   * Runs a post request from the api
   *
   * @param fullRoute - The full route to query
   * @param options - Optional request options
   */
  public async post(fullRoute: RouteLike, options: RequestData = {}) {
    return this.request({ ...options, fullRoute, method: RequestMethod.Post });
  }

  /**
   * Runs a put request from the api
   *
   * @param fullRoute - The full route to query
   * @param options - Optional request options
   */
  public async put(fullRoute: RouteLike, options: RequestData = {}) {
    return this.request({ ...options, fullRoute, method: RequestMethod.Put });
  }

  /**
   * Runs a patch request from the api
   *
   * @param fullRoute - The full route to query
   * @param options - Optional request options
   */
  public async patch(fullRoute: RouteLike, options: RequestData = {}) {
    return this.request({ ...options, fullRoute, method: RequestMethod.Patch });
  }

  public parseResponse(body: any) {
    return body.result;
  }
  /**
   * Runs a request from the api
   *
   * @param options - Request options
   */
  public async request(options: InternalRequest) {
    const response = await this.queueRequest(options);
    return this.parseResponse(response.body);
  }
  /**
   * Sets the default agent to use for requests performed by this manager
   *
   * @param agent - The agent to use
   */
  public setAgent(agent: Agent) {
    this.agent = agent;
    return this;
  }

  /**
   * Sets the authorization token that should be used for requests
   *
   * @param token - The authorization token to use
   */
  public setToken(token: string | null) {
    this.#token = token;
    return this;
  }
  /**
   * Queues a request to be sent
   *
   * @param request - All the information needed to make a request
   * @returns The response from the api request
   */
  public async queueRequest(request: InternalRequest): Promise<ResponseLike> {
    const hash = 'global';

    const handler = this.handlers.get(hash) ?? this.createHandler(hash);

    const { url, fetchOptions } = await this.resolveRequest(request);

    return handler.queueRequest(url, fetchOptions, {
      body: request.body,
      files: request.files,
      token: request.token,
      signal: request.signal,
    });
  }

  private createHandler(hash: string) {
    // Create the async request queue to handle requests
    const queue = new SequentialHandler(this, hash);
    // Save the queue based on its id
    this.handlers.set(queue.id, queue);

    return queue;
  }
  /**
   * Formats the request data to a usable format for fetch
   *
   * @param request - The request data
   */
  private async resolveRequest(
    request: InternalRequest
  ): Promise<{ fetchOptions: AxiosRequestConfig; url: string }> {
    const { options } = this;

    let query = '';

    if (request.query) {
      const resolvedQuery = qs.stringify(request.query);
      if (resolvedQuery !== '') {
        query = `?${resolvedQuery}`;
      }
    }

    // Create the required headers
    const headers: RequestHeaders = {
      ...this.options.headers,
      'User-Agent': DefaultUserAgent,
    };

    const token = request.token ?? this.#token;

    if (!token) {
      throw new Error(
        'Expected token to be set for this request, but none was present'
      );
    }

    const url = `${options.api}/bot${token}${request.fullRoute}${query}`;

    let finalBody: AxiosRequestConfig['data'];
    let additionalHeaders: Record<string, string> = {};

    if (request.files?.length) {
      const formData = new FormData();

      for (const [index, file] of request.files.entries()) {
        const fileKey = file.key ?? `files[${index}]`;

        if (isBufferLike(file.data)) {
          let contentType = file.contentType;

          if (!contentType) {
            const [parsedType] = filetypeinfo(file.data);

            if (parsedType) {
              contentType = parsedType.mime ?? 'application/octet-stream';
            }
          }

          formData.append(
            fileKey,
            new Blob([file.data], { type: contentType }),
            file.name
          );
        } else {
          formData.append(
            fileKey,
            new Blob([`${file.data}`], { type: file.contentType }),
            file.name
          );
        }
      }

      if (request.body != null) {
        for (const [key, value] of Object.entries(
          request.body as Record<string, unknown>
        )) {
          formData.append(key, value);
        }
      }

      finalBody = formData;

      // eslint-disable-next-line no-eq-null, eqeqeq
    } else if (request.body != null) {
      if (request.passThroughBody) {
        finalBody = request.body;
      } else {
        finalBody = JSON.stringify(request.body);
        additionalHeaders = { 'Content-Type': 'application/json' };
      }
    }

    const method = request.method.toUpperCase();

    const fetchOptions: AxiosRequestConfig = {
      data: ['GET', 'HEAD'].includes(method) ? null : finalBody!,
      headers: {
        ...request.headers,
        ...additionalHeaders,
        ...headers,
      } as Record<string, string>,
      method,
      httpsAgent: request.agent ?? this.agent ?? undefined!,
    };

    return { url, fetchOptions };
  }
}
