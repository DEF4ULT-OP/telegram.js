import { REST } from '../REST.js';
import {
  APIBotCommand,
  APIBotCommandScope,
  APIBusinessConnection,
  APIFile,
  APIUpdate,
  APIUpdateOptions,
} from './interfaces/bot.js';
import { APIUser } from './interfaces/user.js';

export class BotAPI {
  public constructor(private readonly rest: REST) {}

  async get() {
    return this.rest.get('/getMe') as Promise<APIUser>;
  }

  async getName(languageCode?: string) {
    return this.rest
      .get('/getMyName', { query: { language_code: languageCode } })
      .then(({ name }) => name) as Promise<string>;
  }

  async setName(name: string, languageCode?: string) {
    return this.rest.post('/setMyName', {
      body: { name, language_code: languageCode },
    }) as Promise<boolean>;
  }

  async getDescription(languageCode?: string) {
    return this.rest
      .get('/getMyDescription', { query: { language_code: languageCode } })
      .then(({ description }) => description) as Promise<string>;
  }

  async setDescription(description: string, languageCode?: string) {
    return this.rest.post('/setMyDescription', {
      body: { description, language_code: languageCode },
    }) as Promise<boolean>;
  }

  async getShortDescription(languageCode?: string) {
    return this.rest
      .get('/getMyShortDescription', { query: { language_code: languageCode } })
      .then(({ short_description }) => short_description) as Promise<string>;
  }

  async setShortDescription(description: string, languageCode?: string) {
    return this.rest.post('/setMyShortDescription', {
      body: { short_description: description, language_code: languageCode },
    }) as Promise<boolean>;
  }

  async getCommands(
    scope: APIBotCommandScope = { type: 'default' },
    languageCode?: string
  ) {
    return this.rest.post('/getMyCommands', {
      body: { scope, language_code: languageCode },
    }) as Promise<APIBotCommand[]>;
  }

  async setCommands(
    commands: APIBotCommand[],
    scope: APIBotCommandScope = { type: 'default' },
    languageCode?: string
  ) {
    return this.rest.post('/setMyCommands', {
      body: { commands, scope, language_code: languageCode },
    }) as Promise<boolean>;
  }

  async deleteCommands(
    scope: APIBotCommandScope = { type: 'default' },
    languageCode?: string
  ) {
    return this.rest.post('/deleteMyCommands', {
      body: { scope, language_code: languageCode },
    }) as Promise<boolean>;
  }

  async logout() {
    return this.rest.post('/logOut') as Promise<boolean>;
  }

  async close() {
    return this.rest.post('/close') as Promise<boolean>;
  }

  async getUpdates(options: APIUpdateOptions = {}) {
    return this.rest.get('/getUpdates', {
      query: options,
    }) as Promise<APIUpdate[]>;
  }

  async getBusinessConnection(connectionId: string) {
    return this.rest.get('/getBusinessConnection', {
      query: {
        business_connection_id: connectionId,
      },
    }) as Promise<APIBusinessConnection>;
  }

  async getFile(id: string) {
    return this.rest.get('/getFile', {
      query: { file_id: id },
    }) as Promise<APIFile>;
  }

  async leaveChat(chatId: number) {
    return this.rest.post('/leaveChat', {
      body: {
        chat_id: chatId,
      },
    }) as Promise<boolean>;
  }
}
