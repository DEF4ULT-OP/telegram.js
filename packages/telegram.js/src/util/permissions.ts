import { APIChatMember } from '@telegramjs/rest';

enum PermissionFlags {
  SEND_MESSAGES = 'can_send_messages',
  SEND_AUDIOS = 'can_send_audios',
  SEND_DOCUMENTS = 'can_send_documents',
  SEND_PHOTOS = 'can_send_photos',
  SEND_VIDEOS = 'can_send_videos',
  SEND_VIDEO_NOTES = 'can_send_video_notes',
  SEND_VOICE_NOTES = 'can_send_voice_notes',
  SEND_POLLS = 'can_send_polls',
  SEND_OTHER_MESSAGES = 'can_send_other_messages',
  ADD_WEBPAGE_PREVIEWS = 'can_add_web_page_previews',
  MANAGE_CHAT = 'can_manage_chat',
  MANAGE_TOPICS = 'can_manage_topics',
  MANAGE_VIDEO_CHATS = 'can_manage_video_chats',
  CHANGE_INFO = 'can_change_info',
  INVITE_USERS = 'can_invite_users',
  PROMOTE_MEMBERS = 'can_promote_members',
  RESTRICT_MEMBERS = 'can_restrict_members',
  POST_STORIES = 'can_post_stories',
  EDIT_STORIES = 'can_edit_stories',
  DELETE_STORIES = 'can_delete_stories',
  POST_MESSAGES = 'can_post_messages',
  EDIT_MESSAGES = 'can_edit_messages',
  DELETE_MESSAGES = 'can_delete_messages',
  PIN_MESSAGES = 'can_pin_messages',
}

export type PermissionResolvable = PermissionFlags | PermissionFlags[];

export class Permissions {
  private readonly _removedFlags: PermissionFlags[];
  constructor(
    public readonly flags: PermissionFlags[] = [],
    private readonly isCreator = false
  ) {
    this._removedFlags = [];
  }

  static ALL = Object.values(PermissionFlags);
  static FLAGS = PermissionFlags;

  add(permission: PermissionResolvable) {
    const permissions = Array.isArray(permission) ? permission : [permission];
    for (const permission of permissions) {
      if (!this.flags.includes(permission)) {
        this.flags.push(permission);
      }
    }
  }

  remove(permission: PermissionResolvable) {
    const permissions = Array.isArray(permission) ? permission : [permission];
    for (const permission of permissions) {
      const index = this.flags.indexOf(permission);
      if (index !== -1) {
        this.flags.splice(index, 1);
      }

      if (!this._removedFlags.includes(permission)) {
        this._removedFlags.push(permission);
      }
    }
  }

  has(permission: PermissionResolvable) {
    if (this.isCreator) return true;
    const permissions = Array.isArray(permission) ? permission : [permission];
    return permissions.every((permission) => this.flags.includes(permission));
  }

  any(permissions: PermissionResolvable) {
    if (this.isCreator) return true;

    const permissionsArray = Array.isArray(permissions)
      ? permissions
      : [permissions];
    return permissionsArray.some((permission) =>
      this.flags.includes(permission)
    );
  }

  missing(permission: PermissionResolvable) {
    if (this.isCreator) return false;
    const permissions = Array.isArray(permission) ? permission : [permission];
    return permissions.filter((permission) => !this.flags.includes(permission));
  }

  serialize() {
    const permissions: Record<string, boolean> = {};

    for (const permission of this.flags) {
      permissions[permission] = true;
    }

    for (const permission of this._removedFlags) {
      permissions[permission] = false;
    }

    return permissions;
  }

  toArray() {
    return this.flags;
  }
}

export const resolveMemberPermissions = (data: APIChatMember) => {
  const permissions: PermissionFlags[] = [];

  for (const [_, value] of Object.entries(PermissionFlags)) {
    if (value in data && data[value] === true) {
      permissions.push(value);
    }
  }

  return permissions;
};
