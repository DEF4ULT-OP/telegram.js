import { APIMessage } from './message.js';
import { APIUser } from './user.js';

export interface APIUpdateOptions {
  offset?: number;
  limit?: number;
  timeout?: number;
  allowed_updates?: string[];
}

export interface APIUpdate {
  update_id: number;
  message?: APIMessage;
  channel_post?: APIMessage;
}

export interface APIFile {
  file_id: string;
  file_unique_id: string;
  file_path?: string;
  file_size?: number;
}

export interface APIBusinessConnection {
  id: string;
  user: APIUser;
  user_chat_id: number;
  date: number;
  can_reply: boolean;
  is_enabled: boolean;
}

export interface APIBotCommand {
  command: string;
  description: string;
}

export type APIBotCommandScope =
  | {
      type:
        | 'default'
        | 'all_private_chats'
        | 'all_group_chats'
        | 'all_chat_administrators';
    }
  | {
      type: 'chat' | 'chat_administrators';
      chat_id: number | string;
    }
  | {
      type: 'chat_member';
      chat_id: number | string;
      user_id: string;
    };
