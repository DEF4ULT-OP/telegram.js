import { Client } from '../client/Client';
import { User } from '../structures/User';
import { CachedManager } from './CachedManager';

export class UserManager extends CachedManager<typeof User> {
  constructor(client: Client) {
    super(client, User);
  }
}
