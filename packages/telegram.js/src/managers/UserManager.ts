import { APIUser } from '@telegramjs/rest';
import { Client } from '../client/Client';
import { User } from '../structures/User';
import { TelegramId } from '../util/types';
import { CachedManager } from './CachedManager';

export class UserManager extends CachedManager<
  TelegramId,
  User,
  User | TelegramId
> {
  constructor(client: Client, iterable?: Iterable<APIUser>) {
    super(client, User);
  }
}
