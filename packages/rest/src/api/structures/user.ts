import { APIMediaPhoto } from './media.js';

export class APIUser {
  public readonly id: number;
  public readonly firstName: string;
  public readonly lastName?: string;
  public readonly username?: string;
  public readonly languageCode?: string;
  public readonly isBot: boolean;
  public readonly isPremium?: boolean;
  public readonly canJoinGroups?: boolean;
  public readonly canReadAllGroupMessages?: boolean;
  public readonly canSupportInlineQueries?: boolean;
  public readonly canConnectToBusiness?: boolean;
  public readonly hasWebApp?: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.firstName = data.first_name;
    this.lastName = data.last_name ?? null;
    this.username = data.username ?? null;
    this.languageCode = data.language_code ?? null;
    this.isBot = data.is_bot;
    this.isPremium = data.is_premium ?? null;
    this.canJoinGroups = data.can_join_groups ?? null;
    this.canReadAllGroupMessages = data.can_read_all_group_messages ?? null;
    this.canSupportInlineQueries = data.supports_inline_queries ?? null;
    this.canConnectToBusiness = data.can_connect_to_business ?? null;
    this.hasWebApp = data.has_web_app ?? null;
  }
}

export interface APIUserProfilePhotos {
  totalCount: number;
  photos: APIMediaPhoto[];
}
