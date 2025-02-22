import { APIMessage } from './message.js';
import { APIUser } from './user.js';

export enum APIChatType {
  Private = 'private',
  Group = 'group',
  Supergroup = 'supergroup',
  Channel = 'channel',
}

export enum APIChatPermissions {
  can_send_messages = 'can_send_messages',
  can_send_audios = 'can_send_audios',
  can_send_documents = 'can_send_documents',
  can_send_photos = 'can_send_photos',
  can_send_videos = 'can_send_videos',
  can_send_video_notes = 'can_send_video_notes',
  can_send_voice_notes = 'can_send_voice_notes',
  can_send_polls = 'can_send_polls',
  can_send_other_messages = 'can_send_other_messages',
  can_add_web_page_previews = 'can_add_web_page_previews',
  can_change_info = 'can_change_info',
  can_invite_users = 'can_invite_users',
  can_pin_messages = 'can_pin_messages',
  can_manage_topics = 'can_manage_topics',
}

export interface APICreateChatLinkOptions {
  name?: string;
  expire_date?: number;
  member_limit?: number;
  creates_join_request?: boolean;
}

export interface APIChatInviteLink {
  name?: string;
  invite_link: string;
  creator: APIUser;
  creates_join_request: boolean;
  is_primary: boolean;
  is_revoked: boolean;
  expire_date?: number;
  member_limit?: number;
  pending_join_request_count?: number;
  subscription_period?: number;
  subscription_price?: number;
}
export interface APIChatPhoto {
  small_file_id: string;
  small_file_unique_id: string;
  big_file_id: string;
  big_file_unique_id: string;
}

export type APIChatBoostSource =
  | {
      source: 'premium' | 'gift_code';
      user: APIUser;
    }
  | {
      source: 'giveaway';
      user: APIUser;
      giveaway_message_id: number;
      prize_star_count?: number;
      is_unclaimed?: number;
    };
export interface APIChatBoost {
  boost_id: string;
  add_date: number;
  expiration_date: number;
  source: APIChatBoostSource;
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

export interface APIChatMember {
  status: string;
  user: APIUser;
  is_anonymous: boolean;
  is_member?: boolean;
  custom_title?: string;
  can_be_edited?: boolean;
  can_manage_chat?: boolean;
  can_delete_messages?: boolean;
  can_manage_voice_chats?: boolean;
  can_manage_video_chats?: boolean;
  can_restrict_members?: boolean;
  can_promote_members?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_post_stories?: boolean;
  can_edit_stories?: boolean;
  can_delete_stories?: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
  until_date?: number;
  can_send_messages?: boolean;
  can_send_audios?: boolean;
  can_send_documents?: boolean;
  can_send_photos?: boolean;
  can_send_videos?: boolean;
  can_send_video_notes?: boolean;
  can_send_voice_notes?: boolean;
  can_send_polls?: boolean;
  can_send_other_messages?: boolean;
  can_add_web_page_previews?: boolean;
}
