import { Collection } from '@telegramjs/collection';
import { Client } from '../client/Client';
import { Constructable } from '../util/types';
import { DataManager } from './DataManager';

export class CachedManager<Key, Holds, Resolvable> extends DataManager<
  Key,
  Holds,
  Resolvable
> {
  private readonly _cache: Collection<Key, Holds>;
  constructor(
    client: Client,
    holds: Constructable<Holds>,
    iterable?: Iterable<Holds>
  ) {
    super(client, holds);

    // @ts-expect-error
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
    data: any,
    cache: boolean = true,
    { id, extras = [] }: { id?: Key; extras?: unknown[] } = {}
  ) {
    const existing: any = this.cache.get(id ?? data.id);
    if (existing) {
      if (cache) {
        existing._patch(data);
        return existing;
      }
      const clone = existing._clone();
      clone._patch(data);
      return clone;
    }

    const entry = this.holds
      ? // @ts-ignore
        new this.holds(this.client, data, ...extras)
      : data;
    if (cache) this.cache.set(id ?? entry.id, entry);
    return entry;
  }
}
