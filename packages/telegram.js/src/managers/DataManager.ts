import { Collection } from '@telegramjs/collection';
import { Client } from '../client/Client.js';
import { ErrorCodes } from '../errors/errorCodes.js';
import { TelegramjsError } from '../errors/TJSError.js';
import { Constructable } from '../util/types.js';
import { BaseManager } from './BaseManager.js';

export class DataManager<Key, Holds, Resolvable> extends BaseManager {
  protected constructor(
    client: Client,
    protected readonly holds: Constructable<Holds>
  ) {
    super(client);
  }

  get cache(): Collection<Key, Holds> {
    throw new TelegramjsError(
      ErrorCodes.NotImplemented,
      'get cache',
      this.constructor.name
    );
  }

  resolve(idOrInstance: Resolvable | Holds) {
    if (idOrInstance instanceof this.holds) return idOrInstance;

    if (typeof idOrInstance === 'string' || typeof idOrInstance === 'number') {
      return this.cache.get(idOrInstance as Key) ?? null;
    }

    return null;
  }
}
