import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Agent } from 'node:https';
import { Readable } from 'node:stream';

export interface RestEvents {
  response: [request: APIRequest, response: ResponseLike];
  restDebug: [info: string];
  rateLimited: [any];
}

export interface RESTOptions {
  /**
   * The agent to set globally
   */
  agent: Agent | null;
  /**
   * The base api path, without version
   *
   * @defaultValue `'https://api.telegram.org'`
   */
  api: string;

  /**
   * How many requests to allow sending per second (Infinity for unlimited, 50 for the standard global limit used by Discord)
   *
   * @defaultValue `50`
   */
  globalRequestsPerSecond: number;
  /**
   * The amount of time in milliseconds that passes between each hash sweep. (defaults to 1h)
   *
   * @defaultValue `3_600_000`
   */
  handlerSweepInterval: number;

  /**
   * Additional headers to send for all API requests
   *
   * @defaultValue `{}`
   */
  headers: Record<string, string>;
  /**
   * The number of invalid REST requests (those that return 401, 403, or 429) in a 10 minute window between emitted warnings (0 for no warnings).
   * That is, if set to 500, warnings will be emitted at invalid request number 500, 1000, 1500, and so on.
   *
   * @defaultValue `0`
   */
  invalidRequestWarningInterval: number;
  /**
   * The method called to perform the actual HTTP request given a url and web `fetch` options
   * For example, to use global fetch, simply provide `makeRequest: fetch`
   */
  makeRequest(url: string, init: AxiosRequestConfig): Promise<ResponseLike>;

  /**
   * The number of retries for errors with the 500 code, or errors
   * that timeout
   *
   * @defaultValue `3`
   */
  retries: number;
  /**
   * The time to wait in milliseconds before a request is aborted
   *
   * @defaultValue `15_000`
   */
  timeout: number;

  /**
   * The extra offset to add to rate limits in milliseconds
   *
   * @defaultValue `50`
   */
  offset: number;
}

/**
 * 
/**
 * Represents a file to be added to the request
 */
export interface RawFile {
  /**
   * Content-Type of the file
   */
  contentType?: string;
  /**
   * The actual data for the file
   */
  data: Buffer | Uint8Array | boolean | number | string;
  /**
   * An explicit key to use for key of the formdata field for this file.
   * When not provided, the index of the file in the files array is used in the form `files[${index}]`.
   * If you wish to alter the placeholder snowflake, you must provide this property in the same form (`files[${placeholder}]`)
   */
  key?: string;
  /**
   * The name of the file
   */
  name: string;
}

export interface RequestData {
  /**
   * Alternate bot token to use for this request only
   *
   * @defaultValue `true`
   */
  token?: string | undefined;
  /**
   * The body to send to this request.
   * If providing as BodyInit, set `passThroughBody: true`
   */
  body?: unknown;

  agent?: Agent;
  /**
   * Files to be attached to this request
   */
  files?: RawFile[] | undefined;
  /**
   * Additional headers to add to this request
   */
  headers?: Record<string, string>;
  /**
   * Whether to pass-through the body property directly to `fetch()`.
   * <warn>This only applies when files is NOT present</warn>
   */
  passThroughBody?: boolean;
  /**
   * Query string parameters to append to the called endpoint
   */
  query?: Record<string, any>;
  /**
   * Reason to show in the audit logs
   */
  reason?: string | undefined;
  /**
   * The signal to abort the queue entry or the REST call, where applicable
   */
  signal?: AbortSignal | undefined;
  /**
   * If this request should be versioned
   *
   * @defaultValue `true`
   */
  versioned?: boolean;
}

export interface RequestHeaders {
  Authorization?: string;
  'User-Agent': string;
  'X-Audit-Log-Reason'?: string;
}

/**
 * Possible API methods to be used when doing requests
 */
export enum RequestMethod {
  Delete = 'DELETE',
  Get = 'GET',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
}

export type RouteLike = `/${string}`;

export interface InternalRequest extends RequestData {
  fullRoute: RouteLike;
  method: RequestMethod;
}

export interface HandlerRequestData
  extends Pick<InternalRequest, 'body' | 'files' | 'signal'> {
  token: string | undefined;
}

export interface APIRequest {
  /**
   * The data that was used to form the body of this request
   */
  data: HandlerRequestData;
  /**
   * The HTTP method used in this request
   */
  method: string;
  /**
   * Additional HTTP options for this request
   */
  options: AxiosRequestConfig;
  /**
   * The full path used to make the request
   */
  path: RouteLike;
  /**
   * The number of times this request has been attempted
   */
  retries: number;
  /**
   * The API route identifying the ratelimit for this request
   */
  route: string;
}

export interface ResponseLike
  extends Pick<AxiosResponse, 'status' | 'statusText' | 'headers'> {
  body: Readable | ReadableStream | null;
}

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
