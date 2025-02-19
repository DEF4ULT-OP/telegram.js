import { BufferResolvable } from '@telegramjs/util';
import { APIChat } from './chat.js';
import { APIUser } from './user.js';

export interface APIMessageEntity {}

export interface APIBaseMessageOptions {
  message_thread_id?: number;
  business_connection_id?: string;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: any;
  reply_markup?: any;
}
export interface APIMessageOptions extends APIBaseMessageOptions {
  business_connection_id?: string;

  parse_mode?: string;
  entities?: APIMessageEntity[];
  link_preview_options?: {
    is_disabled?: boolean;
    url?: string;
    prefer_small_media?: boolean;
    prefer_large_media?: boolean;
    show_above_text?: boolean;
  };
}

export interface APIMediaMessageOptions extends APIMessageOptions {
  caption?: string;
  caption_entities?: APIMessageEntity[];
  show_caption_above_media?: boolean;
  has_spoiler?: boolean;
}

export interface APIAudioMessageOptions extends APIMediaMessageOptions {
  duration?: number;
  performer?: string;
  title?: string;
  thumbnail?: BufferResolvable;
}

export interface APIDocumentMessageOptions extends APIMediaMessageOptions {
  thumbnail?: BufferResolvable;
  disable_content_type_detection?: boolean;
}

export interface APIVoiceMessageOptions extends APIMediaMessageOptions {
  duration?: number;
}

export interface APIVideoNoteMessageOptions extends APIMediaMessageOptions {
  duration?: number;
  length?: number;
}

export interface APIVideoMessageOptions extends APIMediaMessageOptions {
  duration?: number;
  width?: number;
  height?: number;
  thumbnail?: BufferResolvable;
  cover?: BufferResolvable;
  start_timestamp?: number;
}

export interface APIAnimationMessageOptions extends APIMediaMessageOptions {
  duration?: number;
  width?: number;
  height?: number;
  thumbnail?: BufferResolvable;
}

export interface APIAudioMessageOptions extends APIMediaMessageOptions {
  duration?: number;
}

export interface APIVideoNoteMessageOptions extends APIMediaMessageOptions {
  duration?: number;
  length?: number;
  thumbnail?: BufferResolvable;
}

export interface APILocationMessageOptions extends APIBaseMessageOptions {
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
}

export interface APIVenueMessage {
  chatId: number;
  latitude: number;
  longitude: number;
  title: number;
  address: number;
}
export interface APIVenueMessageOptions extends APIBaseMessageOptions {
  foursquare_id?: string;
  foursquare_type?: string;
  google_place_id?: string;
  google_place_type?: string;
}

export interface APIContactMessageOptions extends APIBaseMessageOptions {
  vcard?: string;
}

export interface APIPollOption {
  text: string;
  text_parse_mode?: string;
  text_entities: APIMessageEntity[];
}
export interface APIPollMessageOptions extends APIBaseMessageOptions {
  question_parse_mode?: string;
  question_entities?: APIMessageEntity[];
  allows_multiple_answers?: boolean;
  correct_option_id?: string;
  explanation?: string;
  explanation_parse_mode?: string;
  explanation_entities?: APIMessageEntity[];
  open_period?: number;
  close_date?: number;
  is_closed?: boolean;
  is_anonymous?: boolean;
  type?: 'quiz' | 'regular';
}

export type APIDiceEmoji = '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰';

export interface APIDiceMessageOptions extends APIBaseMessageOptions {}

export type APIReactionTypeEmoji =
  | '👍'
  | '👎'
  | '❤'
  | '🔥'
  | '🥰'
  | '👏'
  | '😁'
  | '🤔'
  | '🤯'
  | '😱'
  | '🤬'
  | '😢'
  | '🎉'
  | '🤩'
  | '🤮'
  | '💩'
  | '🙏'
  | '👌'
  | '🕊'
  | '🤡'
  | '🥱'
  | '🥴'
  | '😍'
  | '🐳'
  | '❤‍🔥'
  | '🌚'
  | '🌭'
  | '💯'
  | '🤣'
  | '⚡'
  | '🍌'
  | '🏆'
  | '💔'
  | '🤨'
  | '😐'
  | '🍓'
  | '🍾'
  | '💋'
  | '🖕'
  | '😈'
  | '😴'
  | '😭'
  | '🤓'
  | '👻'
  | '👨‍💻'
  | '👀'
  | '🎃'
  | '🙈'
  | '😇'
  | '😨'
  | '🤝'
  | '✍'
  | '🤗'
  | '🫡'
  | '🎅'
  | '🎄'
  | '☃'
  | '💅'
  | '🤪'
  | '🗿'
  | '🆒'
  | '💘'
  | '🙉'
  | '🦄'
  | '😘'
  | '💊'
  | '🙊'
  | '😎'
  | '👾'
  | '🤷‍♂'
  | '🤷'
  | '🤷‍♀'
  | '😡';

export interface APIReactionTypeCustomEmoji {
  type: 'custom_emoji';
  custom_emoji_id: string;
}

export interface APIReactionTypePaid {
  type: 'paid';
}

export interface APIForwardMessageOptions extends APIBaseMessageOptions {}

export interface APICopyMessageOptions
  extends Omit<APIMessageOptions, 'business_connection_id' | 'entities' | ''> {
  video_start_timestamp?: number;
  caption?: string;
  caption_entities?: string;
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
