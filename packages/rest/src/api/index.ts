import { REST } from '../REST.js';
import { ChatsAPI } from './chat.js';
import { APIUpdate, APIUpdateOptions } from './interfaces/update.js';
import { UsersAPI } from './user.js';

export class API {
  public readonly users: UsersAPI;
  public readonly chats: ChatsAPI;

  public constructor(public readonly rest: REST) {
    this.users = new UsersAPI(this.rest);
    this.chats = new ChatsAPI(this.rest);
  }

  public async getUpdates(options: APIUpdateOptions = {}) {
    return this.rest.get('/getUpdates', {
      query: options,
    }) as Promise<APIUpdate[]>;
  }
}
