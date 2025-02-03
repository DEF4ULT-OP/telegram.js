export enum APIChatType {
  Private = 'private',
  Group = 'group',
  Supergroup = 'supergroup',
  Channel = 'channel',
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
