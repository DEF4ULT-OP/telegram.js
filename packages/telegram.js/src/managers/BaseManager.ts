import { Client } from '../client/Client.js';

export class BaseManager {
  constructor(public readonly client: Client) {}
}
