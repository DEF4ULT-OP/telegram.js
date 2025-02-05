import { APIUser } from '@telegramjs/rest';
import { Client } from '../client/Client.js';
import { User } from '../structures/User.js';
import { TelegramId } from '../util/types.js';
import { CachedManager } from './CachedManager.js';

export class UserManager extends CachedManager<
  TelegramId,
  User,
  APIUser,
  TelegramId
> {
  constructor(client: Client, iterable?: Iterable<APIUser>) {
    super(client, User, iterable);
  }
}
