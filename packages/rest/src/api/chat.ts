import {
  BufferResolvable,
  resolveFile,
  resolveFileIdOrFile,
} from '@telegramjs/util';
import { REST } from '../REST.js';
import { APIChat, APIChatMember } from './interfaces/chat.js';
import {
  APIMediaMessageOptions,
  APIMessage,
  APIMessageOptions,
} from './interfaces/message.js';
import { RequestData } from '../utils/types.js';

export class ChatsAPI {
  public constructor(private readonly rest: REST) {}

  get(chatId: number) {
    return this.rest.get('/getChat', {
      query: { chat_id: chatId },
    }) as Promise<APIChat>;
  }

  getMember(chatId: number, userId: number) {
    return this.rest.get('/getChatMember', {
      query: {
        chat_id: chatId,
        user_id: userId,
      },
    }) as Promise<APIChatMember>;
  }

  getMemberCount(chatId: number) {
    return this.rest.get('/getChatMemberCount', {
      query: {
        chat_id: chatId,
      },
    }) as Promise<number>;
  }

  getAdmins(chatId: number) {
    return this.rest.get('/getChatAdministrators', {
      query: {
        chat_id: chatId,
      },
    }) as Promise<APIChatMember[]>;
  }

  leave(chatId: number) {
    return this.rest.post('/leaveChat', {
      body: { chat_id: chatId },
    }) as Promise<boolean>;
  }

  setTitle(chatId: number, title: string) {
    return this.rest.post('/setChatTitle', {
      body: { chat_id: chatId, title },
    }) as Promise<boolean>;
  }

  setDescription(chatId: number, description: string) {
    return this.rest.post('/setChatDescription', {
      body: { chat_id: chatId, description },
    }) as Promise<boolean>;
  }

  async setPhoto(chatId: number, photo: BufferResolvable) {
    const file = await resolveFile(photo);

    return this.rest.post('/setChatPhoto', {
      body: {
        chat_id: chatId,
      },
      files: [
        {
          key: 'photo',
          name: 'photo.jpg',
          ...file,
        },
      ],
    }) as Promise<boolean>;
  }

  async deletePhoto(chatId: number) {
    return this.rest.post('/deleteChatPhoto', {
      body: {
        chat_id: chatId,
      },
    }) as Promise<boolean>;
  }

  async sendMessage(
    chatId: number,
    text: string,
    options: APIMessageOptions = {}
  ) {
    return this.rest.post('/sendMessage', {
      body: {
        chat_id: chatId,
        text,
        ...options,
      },
    }) as Promise<APIMessage>;
  }

  async sendPhoto(
    chatId: number,
    photo: BufferResolvable,
    options: APIMediaMessageOptions = {}
  ) {
    const file = await resolveFileIdOrFile(photo);

    const reqOptions: RequestData = {
      body: {
        chat_id: chatId,
        caption: options.caption,
        ...options,
      },
    };

    if (typeof file === 'string') {
      reqOptions.body!['photo'] = file;
    } else {
      reqOptions.files = [
        {
          key: 'photo',
          name: 'photo.jpg',
          ...file,
        },
      ];
    }

    return this.rest.post('/sendPhoto', reqOptions) as Promise<APIMessage>;
  }

  sendAction(
    chatId: number,
    action: string,
    options: {
      threadId?: number;
      businessId?: number;
    } = {}
  ) {
    return this.rest.post('/sendChatAction', {
      body: {
        chat_id: chatId,
        action,
        message_thread_id: options.threadId,
        business_connection_id: options.businessId,
      },
    }) as Promise<boolean>;
  }
}
