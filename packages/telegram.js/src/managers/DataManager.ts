import { Client } from '../client/Client';
import { ErrorCodes } from '../errors/errorCodes';
import { TelegramjsError } from '../errors/TJSError';
import { BaseManager } from './BaseManager';

export class DataManager<T> extends BaseManager {
  constructor(
    client: Client,
    public readonly holds: T
  ) {
    super(client);
  }

  get cache(): Map<string, T> {
    throw new TelegramjsError(
      ErrorCodes.NotImplemented,
      'get cache',
      this.constructor.name
    );
  }

  resolve(idOrInstance: string | T) {
    if (typeof idOrInstance === 'string') {
      return this.cache.get(idOrInstance) ?? null;
    }

    // @ts-ignore
    if (idOrInstance instanceof this.holds) return idOrInstance;

    return null;
  }
}
