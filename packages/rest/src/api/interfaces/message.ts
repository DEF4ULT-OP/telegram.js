import { APIChat } from './chat.js';
import { APIUser } from './user.js';

export interface APIMessageOptions {
  business_connection_id?: string;
  message_thread_id?: number;
  parse_mode?: string;
  entities?: [];
  link_preview_options?: {
    is_disabled?: boolean;
    url?: string;
    prefer_small_media?: boolean;
    prefer_large_media?: boolean;
    show_above_text?: boolean;
  };
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: any;
  reply_markup?: any;
}

export interface APIMediaMessageOptions extends APIMessageOptions {
  caption?: string;
  caption_entities?: [];
  show_caption_above_media?: boolean;
  has_spoiler?: boolean;
}
export interface APIMessage {
  message_id: number;
  message_thread_id?: number;
  from?: APIUser;
  sender_chat?: APIChat;
  sender_boot_count?: number;
  sender_business_bot?: APIUser;
  date: number;
  business_connection_id?: string;
  chat: APIChat;
  forward_origin?: any;
  is_topic_message?: boolean;
  is_automatic_forward?: boolean;
  reply_to_message?: APIMessage;
  external_reply?: any;
  quote?: any;
  reply_to_story?: any;
  via_bot?: boolean;
  edit_date?: number;
  has_protected_content?: boolean;
  is_from_offline?: boolean;
  media_group_id?: string;
  author_signature?: string;
  text?: string;
  entities: any;
  link_preview_options?: any;
  effect_id?: string;
  animation?: any;
  audio?: any;
  document?: any;
  paid_media?: any;
  photo?: any;
  sticker?: any;
  story?: any;
  video?: any;
  video_note?: any;
  voice?: any;
  caption?: string;
}
