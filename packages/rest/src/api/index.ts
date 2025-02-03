import { REST } from '../REST.js';
import { APIUpdate, APIUpdateOptions } from './structures/update.js';
import { UsersAPI } from './user.js';

export class API {
  public readonly users: UsersAPI;

  public constructor(public readonly rest: REST) {
    this.users = new UsersAPI(this.rest);
  }

  public async getUpdates({
    offset,
    limit,
    timeout,
    allowedUpdates,
  }: APIUpdateOptions = {}): Promise<APIUpdate[]> {
    const options = {
      offset,
      limit,
      timeout,
      allowed_updates: allowedUpdates,
    };

    return this.rest
      .get('/getUpdates', {
        query: options,
      })
      .then((updates) => updates.map((update: any) => new APIUpdate(update)));
  }
}
