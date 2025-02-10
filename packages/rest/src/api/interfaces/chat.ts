import { APIMessage } from './message.js';

export enum APIChatType {
  Private = 'private',
  Group = 'group',
  Supergroup = 'supergroup',
  Channel = 'channel',
}

export interface APIChatPhoto {
  small_file_id: string;
  small_file_unique_id: string;
  big_file_id: string;
  big_file_unique_id: string;
}
export interface APIChat {
  id: number;
  type: APIChatType;
  title?: string;
  username?: string;
  first_name?: string;
  last_name: string;
  is_forum?: boolean;
}

export interface APIChatFull extends APIChat {
  description?: string;
  invite_link?: string;
  bio?: string;
  active_usernames?: string[];
  photo?: APIChatPhoto[];
  pinned_message?: APIMessage;
  linked_chat_id?: number;
  location?: any;

  max_reaction_count: number;
  slow_mode_delay?: number;
  unrestrict_boost_count?: number;
  message_auto_delete_time?: number;

  accent_color_id: number;
  profile_accent_color_id?: number;
  profile_background_custom_emoji_id?: string;

  background_custom_emoji_id?: string;
  emoji_status_custom_emoji_id?: string;
  emoji_status_expiration_date?: number;
  custom_emoji_sticker_set_name?: string;

  has_private_forwards?: boolean;
  has_restricted_voice_and_video_messages: boolean;
  join_to_send_messages?: boolean;
  join_by_request?: boolean;
  can_send_paid_media?: boolean;
  has_aggressive_anti_spam_enabled?: boolean;
  has_hidden_members?: boolean;
  has_protected_content?: boolean;
  has_visible_history?: boolean;
  can_set_sticker_set?: boolean;
}
