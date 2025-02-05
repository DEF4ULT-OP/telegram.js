'use strict';

import { Client } from '../client/Client.js';
import { flatten } from '../util/utils.js';

/**
 * Represents a data model .
 * @abstract
 */
export abstract class Base<I, T> {
  public id!: I;
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

  valueOf(): I {
    return this.id;
  }
}
