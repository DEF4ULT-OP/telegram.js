import { APIUser } from '@telegramjs/rest';
import { Base } from './Base.js';
import { Client } from '../client/Client.js';

export class User extends Base<APIUser> {
  public id: number;
  public firstName!: string;
  public lastName?: string;
  public username?: string;
  public languageCode?: string;
  public isBot: boolean;
  public isPremium?: boolean;
  public isAddedToAttachmentMenu?: boolean;
  public canJoinGroups?: boolean;
  public canReadGroupMessages?: boolean;
  public canConnectToBusiness?: boolean;
  public canSupportInlineQueries?: boolean;
  public hasWeb?: boolean;

  constructor(client: Client, data: APIUser) {
    super(client);

    this.id = data.id;
    this.isBot = data.is_bot;

    this._patch(data);
  }
  override _patch(data: APIUser) {
    this.firstName = data.first_name;

    if ('last_name' in data) {
      this.lastName = data.last_name;
    }

    if ('username' in data) {
      this.username = data.username;
    }

    if ('language_code' in data) {
      this.languageCode = data.language_code;
    }

    if ('is_premium' in data) {
      this.isPremium = data.is_premium;
    }

    if ('added_to_attachment_menu' in data) {
      this.isAddedToAttachmentMenu = data.added_to_attachment_menu;
    }

    if ('can_join_groups' in data) {
      this.canJoinGroups = data.can_join_groups;
    }

    if ('can_read_all_group_messages' in data) {
      this.canReadGroupMessages = data.can_read_all_group_messages;
    }

    if ('supports_inline_queries' in data) {
      this.canSupportInlineQueries = data.supports_inline_queries;
    }

    if ('has_main_web_app' in data) {
      this.hasWeb = data.has_main_web_app;
    }
  }
}
