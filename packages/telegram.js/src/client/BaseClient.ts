'use strict';

import { ClientOptions, Options } from './../util/options.js';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import { TelegramjsTypeError } from '../errors/TJSError.js';
import { ErrorCodes } from '../errors/errorCodes.js';
import { API, REST } from '@telegramjs/rest';
import { flatten } from '../util/utils.js';
import { EventHandlerMap } from '../util/types.js';

/**
 * The base class for all clients.
 * @extends {AsyncEventEmitter}
 */
export class BaseClient extends AsyncEventEmitter {
  public readonly options: ClientOptions;
  public readonly rest: REST;
  public readonly api: API;

  constructor(options: Partial<ClientOptions>) {
    super();

    if (typeof options !== 'object' || options === null) {
      throw new TelegramjsTypeError(
        ErrorCodes.InvalidType,
        'options',
        'object',
        true
      );
    }

    const defaultOptions = Options.createDefault();

    this.options = {
      ...defaultOptions,
      ...options,
    };

    /**
     * The REST manager of the client
     * @type {REST}
     */
    this.rest = new REST(this.options.rest);

    this.api = new API(this.rest);
  }

  destroy() {}

  /**
   * Increments max listeners by one, if they are not zero.
   * @private
   */
  incrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners + 1);
    }
  }

  /**
   * Decrements max listeners by one, if they are not zero.
   * @private
   */
  decrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners - 1);
    }
  }

  override on<E extends keyof EventHandlerMap>(
    event: E,
    listener: EventHandlerMap[E]
  ): this {
    return super.on(event, listener as any);
  }

  override emit<E extends keyof EventHandlerMap>(
    event: E,
    ...args: Parameters<EventHandlerMap[E]>
  ): boolean {
    return super.emit(event, ...(args as any));
  }

  toJSON(...props: any[]) {
    return flatten(this, ...props);
  }
}
