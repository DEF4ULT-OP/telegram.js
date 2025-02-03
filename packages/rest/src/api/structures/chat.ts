export enum APIChatType {
  PRIVATE = 'private',
  GROUP = 'group',
  SUPERGROUP = 'supergroup',
  CHANNEL = 'channel',
}

export class APIChat {
  public readonly id: number;
  public readonly type: APIChatType;
  public readonly title?: string;
  public readonly username?: string;
  public readonly firstName?: string;
  public readonly lastName?: string;
  public readonly isForum?: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.type = data.type;
    this.title = data.title ?? null;
    this.username = data.username ?? null;
    this.firstName = data.first_name ?? null;
    this.lastName = data.last_name ?? null;
    this.isForum = data.is_forum ?? null;
  }
}

export class APIChatFull extends APIChat {
  public readonly accentColor: string;
  public readonly maxReactionCount: number;
  public readonly photo?: APIChatPhoto;
  public readonly activeUsernames?: string[];
  public readonly personalChat?: APIChat;

  constructor(data: any) {
    super(data);

    this.accentColor = data.accent_color;
    this.maxReactionCount = data.max_reaction_count;

    if (data.photo) {
      this.photo = new APIChatPhoto(data.photo);
    }

    this.activeUsernames = data.active_usernames ?? [];

    if (data.personal_chat) {
      this.personalChat = new APIChat(data.personal_chat);
    }
  }
}

export class APIChatPhoto {
  public readonly smallFileId: string;
  public readonly smallUniqueId: string;
  public readonly bigFileId: string;
  public readonly bigUniqueId: string;

  constructor(data: any) {
    this.smallFileId = data.small_file_id;
    this.smallUniqueId = data.small_unique_id;
    this.bigFileId = data.big_file_id;
    this.bigUniqueId = data.big_unique_id;
  }
}
