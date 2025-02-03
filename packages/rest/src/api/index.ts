import { REST } from '../REST.js';
import { APIUpdate, APIUpdateOptions } from './interfaces/update.js';
import { UsersAPI } from './user.js';

export class API {
  public readonly users: UsersAPI;

  public constructor(public readonly rest: REST) {
    this.users = new UsersAPI(this.rest);
  }

  public async getUpdates(options: APIUpdateOptions = {}) {
    return this.rest.get('/getUpdates', {
      query: options,
    }) as Promise<APIUpdate[]>;
  }
}
