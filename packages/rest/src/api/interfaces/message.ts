export class APIMessage {
  public readonly id: string;
  public readonly text?: string;
  public readonly caption?: string;
  public readonly thread_id?: number;
  public readonly chat?: APIChat;
  public readonly from?: APIUser;
  public readonly sender_chat?: APIChat;
  public readonly isTopic?: boolean;
  public readonly isProtected?: boolean;
  public readonly isFromOffline?: boolean;
  public readonly isSentViaBot?: boolean;
  public readonly isAutoForwarded?: boolean;
  public readonly replyToMessage?: APIMessage;
  public readonly createdAt: Date;
  public readonly updatedAt?: Date;

  constructor(data: any) {
    this.id = data.message_id;
    this.createdAt = new Date(data.date * 1000);

    if ('text' in data) {
      this.text = data.text;
    }

    if ('caption' in data) {
      this.caption = data.caption;
    }

    if ('thread_id' in data) {
      this.threadId = data.message_thread_id;
    }

    if ('chat' in data) {
      this.chat = new APIChat(data.chat);
    }

    if ('from' in data) {
      this.from = new APIUser(data.from);
    }

    if ('sender_chat' in data) {
      this.senderChat = new APIChat(data.sender_chat);
    }

    if ('is_topic_message' in data) {
      this.isTopic = data.is_topic_message;
    }

    if ('is_protected' in data) {
      this.isProtected = data.has_protected_content;
    }

    if ('is_from_offline' in data) {
      this.isFromOffline = data.is_from_offline;
    }

    if ('is_sent_via_bot' in data) {
      this.isSentViaBot = data.via_bot;
    }

    if ('is_auto_forwarded' in data) {
      this.isAutoForwarded = data.is_automatic_forward;
    }

    if ('reply_to_message' in data) {
      this.replyToMessage = new APIMessage(data.reply_to_message);
    }

    if ('edit_date' in data) {
      this.updatedAt = new Date(data.edit_date * 1000);
    }
  }
}
