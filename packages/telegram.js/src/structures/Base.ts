'use strict';

import { Client } from '../client/Client';
import { flatten } from '../util/utils';

/**
 * Represents a data model .
 * @abstract
 */
export class Base<T> {
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

  valueOf() {
    // @ts-ignore
    return this.id;
  }
}

exports.Base = Base;
