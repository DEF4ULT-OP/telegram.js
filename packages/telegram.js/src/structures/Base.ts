'use strict';

import { Client } from '../client/Client.js';
import { TelegramId } from '../util/types.js';
import { flatten } from '../util/utils.js';

export type BaseAPIType<T extends Base<any, any>> =
  T extends Base<infer APIType, any> ? APIType : never;

export type BaseConstructor<T extends Base<any, any>> = new (
  client: Client,
  data: BaseAPIType<T>
) => T;

/**
 * Represents a data model .
 * @abstract
 */
export abstract class Base<T, Key = TelegramId> {
  public id!: Key;
  constructor(public readonly client: Client) {}

  _clone() {
    return Object.assign(Object.create(this), this);
  }

  _patch(data: T): any {
    return data;
  }

  _update(data: T) {
    const clone = this._clone();
    this._patch(data);
    return clone;
  }

  toJSON(...props: any) {
    return flatten(this, ...props);
  }

  valueOf(): Key {
    return this.id;
  }
}
