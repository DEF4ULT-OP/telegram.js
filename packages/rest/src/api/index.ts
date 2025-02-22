import { REST } from '../REST.js';
import { BotAPI } from './bot.js';
import { ChatsAPI } from './chat.js';
import { UsersAPI } from './user.js';

export class API {
  public readonly bot: BotAPI;
  public readonly users: UsersAPI;
  public readonly chats: ChatsAPI;

  public constructor(public readonly rest: REST) {
    this.bot = new BotAPI(this.rest);
    this.users = new UsersAPI(this.rest);
    this.chats = new ChatsAPI(this.rest);
  }
}
