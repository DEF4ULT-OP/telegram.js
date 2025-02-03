import { Client } from '../client/Client';
import { DataManager } from './DataManager';

export class CachedManager<T> extends DataManager<any> {
  constructor(client: Client, holds: T, iterable?: T[]) {
    super(client, holds);
  }
}
