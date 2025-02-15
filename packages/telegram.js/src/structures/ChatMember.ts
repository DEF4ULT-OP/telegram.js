import { APIChatMember } from '@telegramjs/rest';
import { Chat } from './Chat.js';
import { Base } from './Base.js';
import { Permissions, resolveMemberPermissions } from '../util/permissions.js';
import { User } from './User.js';

export enum ChatMemberStatus {
  CREATOR = 'creator',
  ADMINISTRATOR = 'administrator',
  MEMBER = 'member',
  RESTRICTED = 'restricted',
}

export class ChatMember extends Base<APIChatMember> {
  public override id: number;
  public title?: string;
  public isAnonymous?: boolean;
  public isMember?: boolean;
  public status!: ChatMemberStatus;
  public user!: User;
  public permissions!: Permissions;

  constructor(
    public readonly chat: Chat,
    data: APIChatMember
  ) {
    super(chat.client);

    this.id = chat.id;
    this.user = new User(chat.client, data.user);

    this._patch(data);
  }

  override _patch(data: APIChatMember) {
    this.status = data.status as ChatMemberStatus;
    this.user = this.chat.client.users._add(data.user);
    this.isAnonymous = data.is_anonymous;

    if ('custom_title' in data) {
      this.title = data.custom_title;
    }

    if ('is_member' in data) {
      this.isMember = data.is_member;
    }

    this.permissions = new Permissions(
      resolveMemberPermissions(data),
      this.status === ChatMemberStatus.CREATOR
    );
  }
}
