'use strict';

import { Collection } from '@telegramjs/collection';
import { TelegramjsError } from '../errors/TJSError';
import { ErrorCodes } from '../errors/errorCodes';

export interface LimitedCollectionOptions<Key, Value> {
  maxSize?: number;
  keepOverLimit?: (
    value: Value,
    key: Key,
    collection: LimitedCollection<Key, Value>
  ) => boolean;
}

/**
 * Options for defining the behavior of a LimitedCollection
 * @typedef {Object} LimitedCollectionOptions
 * @property {?number} [maxSize=Infinity] The maximum size of the Collection
 * @property {?Function} [keepOverLimit=null] A function, which is passed the value and key of an entry, ran to decide
 * to keep an entry past the maximum size
 */

/**
 * A Collection which holds a max amount of entries.
 * @extends {Collection}
 * @param {LimitedCollectionOptions} [options={}] Options for constructing the Collection.
 * @param {Iterable} [iterable=null] Optional entries passed to the Map constructor.
 */
export class LimitedCollection<Key, Value> extends Collection<Key, Value> {
  maxSize: number;
  keepOverLimit:
    | ((
        value: Value,
        key: Key,
        collection: LimitedCollection<Key, Value>
      ) => boolean)
    | null;
  constructor(
    options: LimitedCollectionOptions<Key, Value> = {},
    iterable?: Iterable<readonly [Key, Value]>
  ) {
    if (typeof options !== 'object' || options === null) {
      throw new TelegramjsError(
        ErrorCodes.InvalidType,
        'options',
        'object',
        true
      );
    }
    const { maxSize = Infinity, keepOverLimit = null } = options;

    if (typeof maxSize !== 'number') {
      throw new TelegramjsError(ErrorCodes.InvalidType, 'maxSize', 'number');
    }
    if (keepOverLimit !== null && typeof keepOverLimit !== 'function') {
      throw new TelegramjsError(
        ErrorCodes.InvalidType,
        'keepOverLimit',
        'function'
      );
    }

    super(iterable);

    /**
     * The max size of the Collection.
     * @type {number}
     */
    this.maxSize = maxSize;

    /**
     * A function called to check if an entry should be kept when the Collection is at max size.
     * @type {?Function}
     */
    this.keepOverLimit = keepOverLimit;
  }

  override set(key: Key, value: Value) {
    if (this.maxSize === 0 && !this.keepOverLimit?.(value, key, this))
      return this;
    if (this.size >= this.maxSize && !this.has(key)) {
      for (const [k, v] of this.entries()) {
        const keep = this.keepOverLimit?.(v, k, this) ?? false;
        if (!keep) {
          this.delete(k);
          break;
        }
      }
    }
    return super.set(key, value);
  }

  //   static get [Symbol.species]() {
  //     return Collection;
  //   }
}
