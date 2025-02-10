import { APIChat } from '@telegramjs/rest';
import { Client } from '../client/Client.js';
import { Base } from './Base.js';
import { MessageManager } from '../managers/MessageManager.js';
import { User } from './User.js';
import { Message } from './Message.js';

export enum ChatType {
  Private = 'private',
  Group = 'group',
  Supergroup = 'supergroup',
  Channel = 'channel',
}

export enum ChatAction {
  Typing = 'typing',
  UploadPhoto = 'upload_photo',
  RecordVideo = 'record_video',
  UploadVideo = 'upload_video',
  RecordVoice = 'record_voice',
  UploadVoice = 'upload_voice',
  UploadDocument = 'upload_document',
  ChooseSticker = 'choose_sticker',
  FindLocation = 'find_location',
  RecordVideNote = 'record_video_note',
  UploadVideoNote = 'upload_video_note',
}

export enum MessageParsingMode {
  Markdown = 'markdown',
  MarkdownV2 = 'markdownv2',
  Html = 'html',
}

export enum MessageEntityType {
  Mention = 'mention',
  Hashtag = 'hashtag',
  BotCommand = 'bot_command',
  Url = 'url',
  Email = 'email',
  PhoneNumber = 'phone_number',
  Bold = 'bold',
  Italic = 'italic',
  Underline = 'underline',
  Strikethrough = 'strikethrough',
  Spoiler = 'spoiler',
  BlockQuote = 'blockquote',
  ExpandableBlockQuote = 'expandable_blockquote',
  Code = 'code',
  TextMention = 'text_mention',
  CustomEmoji = 'custom_emoji',
}
export interface MessageEntity {
  type: MessageEntityType;
  offset: number;
  length: number;
  url?: string;
  user?: Partial<User>;
  language?: string;
  custom_emoji_id?: string;
}

export interface MessageOptions {
  mode?: MessageParsingMode;
  silent?: boolean;
  threadId?: number;
  effectId?: string;
  businessId?: string;
  protect?: boolean;
  allowPaidBroadcast?: boolean;
  entities?: MessageEntity[];
}
export class Chat extends Base<APIChat> {
  override id: number;
  public type: ChatType;
  public title?: string;
  description?: string;
  public username?: string;
  public firstName?: string;
  public lastName?: string;

  public readonly messages: MessageManager;

  constructor(client: Client, data: APIChat) {
    super(client);
    this.id = data.id;
    this.type = data.type as unknown as ChatType;

    this.messages = new MessageManager(this);

    this._patch(data);
  }

  override _patch(data: APIChat) {
    if ('title' in data) {
      this.title = data.title;
    }

    if ('username' in data) {
      this.username = data.username;
    }

    if ('first_name' in data) {
      this.firstName = data.first_name;
    }

    if ('last_name' in data) {
      this.lastName = data.last_name;
    }
  }

  async leave(): Promise<boolean> {
    return this.client.api.chats.leave(this.id);
  }

  async setTitle(title: string): Promise<boolean> {
    const result = this.client.api.chats.setTitle(this.id, title);

    this.title = title;

    return result;
  }

  async setDescription(description: string): Promise<boolean> {
    const result = this.client.api.chats.setTitle(this.id, description);

    this.description = description;

    return result;
  }

  async send(text: string, options: MessageOptions = {}): Promise<Message> {
    const rawOptions: any = {
      ...options,
    };

    if ('mode' in options) {
      rawOptions['parse_mode'] = options.mode;
    }

    if ('silent' in options) {
      rawOptions['disable_notification'] = options.silent;
    }

    if ('threadId' in options) {
      rawOptions['message_thread_id'] = options.threadId;
    }

    if ('effectId' in options) {
      rawOptions['message_effect_id'] = options.effectId;
    }

    if ('businessId' in options) {
      rawOptions['business_connection_id'] = options.businessId;
    }

    if ('protect' in options) {
      rawOptions['protect_content'] = options.protect;
    }
    if ('allowPaidBroadcast' in options) {
      rawOptions['allow_paid_broadcast'] = options.allowPaidBroadcast;
    }

    const data = await this.client.api.chats.sendMessage(
      this.id,
      text,
      rawOptions
    );

    const message = this.messages._add(data, false);

    return message;
  }

  async sendAction(
    action: ChatAction,
    options: { threadId?: number; businessId?: number } = {}
  ) {
    return this.client.api.chats.sendAction(
      this.id,
      action,
      options
    ) as Promise<boolean>;
  }

  async startTyping(options: { threadId?: number; businessId?: number } = {}) {
    return this.sendAction(ChatAction.Typing, options);
  }
}
