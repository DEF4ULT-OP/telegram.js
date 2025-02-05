import { REST } from '../REST.js';
import { APIMessage } from './interfaces/message.js';

export class ChatsAPI {
  public constructor(private readonly rest: REST) {}

  sendMessage(chatId: number, text: string, options?: any) {
    return this.rest.post('/sendMessage', {
      body: {
        chat_id: chatId,
        text,
        ...options,
      },
    }) as Promise<APIMessage>;
  }
}
