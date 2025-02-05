import { Collection } from '@telegramjs/collection';
import { Client } from '../client/Client.js';
import { Constructable } from '../util/types.js';
import { DataManager } from './DataManager.js';
import { Base, BaseAPIType } from '../structures/Base.js';

export class CachedManager<
  Key,
  Holds extends Base<BaseAPIType<Holds>, Key>,
  Resolvable = Key | Holds,
> extends DataManager<Key, Holds, Resolvable> {
  private readonly _cache: Collection<Key, Holds>;
  protected constructor(
    client: Client,
    holds: Constructable<Holds>,
    iterable?: Iterable<BaseAPIType<Holds>>
  ) {
    super(client, holds);

    // @ts-ignore
    this._cache = this.client.options.makeCache(
      this.constructor as any,
      this.holds as any,
      this.constructor as any
    );

    if (iterable) {
      for (const item of iterable) {
        this._add(item);
      }
    }
  }

  /**
   * The cache of items for this manager.
   * @type {Collection}
   * @abstract
   */
  override get cache() {
    return this._cache;
  }

  _add(
    data: BaseAPIType<Holds>,
    cache = true,
    options: { id?: Key; extras?: unknown[] } = {}
  ): Holds {
    const entry = new (this.holds as { new (...args: any[]): Holds })(
      this.client,
      data,
      options.extras
    );
    const targetId = options.id ?? entry.id;

    const existing = this.cache.get(targetId);

    if (existing) {
      if (cache) {
        existing._patch(data);
        return existing;
      }
      const clone = existing._clone();
      clone._patch(data);
      return clone;
    }

    if (cache) this.cache.set(targetId ?? entry.id, entry);

    return entry;
  }
}
