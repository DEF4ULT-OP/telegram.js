import { BufferResolvable, resolveFile } from '@telegramjs/util';
import { REST } from '../REST.js';
import {
  APIChat,
  APIChatBoost,
  APIChatInviteLink,
  APIChatMember,
  APIChatPermissions,
  APICreateChatLinkOptions,
} from './interfaces/chat.js';
import {
  APIAnimationMessageOptions,
  APIAudioMessageOptions,
  APIContactMessageOptions,
  APICopyMessageOptions,
  APIDiceEmoji,
  APIDiceMessageOptions,
  APIDocumentMessageOptions,
  APIForwardMessageOptions,
  APILocationMessageOptions,
  APIMediaMessageOptions,
  APIMessage,
  APIMessageOptions,
  APIPollMessageOptions,
  APIPollOption,
  APIReactionTypeCustomEmoji,
  APIReactionTypeEmoji,
  APIReactionTypePaid,
  APIVenueMessage,
  APIVenueMessageOptions,
  APIVideoMessageOptions,
  APIVideoNoteMessageOptions,
  APIVoiceMessageOptions,
} from './interfaces/message.js';
import { prepareMediaRequest } from '../utils/utils.js';

export class ChatsAPI {
  public constructor(private readonly rest: REST) {}

  get(chatId: number) {
    return this.rest.get('/getChat', {
      query: { chat_id: chatId },
    }) as Promise<APIChat>;
  }

  getMember(chatId: number, userId: number) {
    return this.rest.get('/getChatMember', {
      query: {
        chat_id: chatId,
        user_id: userId,
      },
    }) as Promise<APIChatMember>;
  }

  async getMemberBoosts(chatId: number, userId: number) {
    return this.rest
      .get('/getUserChatBoosts', {
        query: {
          chat_id: chatId,
          user_id: userId,
        },
      })
      .then((response) => response.boosts) as Promise<APIChatBoost[]>;
  }

  async getMemberCount(chatId: number) {
    return this.rest.get('/getChatMemberCount', {
      query: {
        chat_id: chatId,
      },
    }) as Promise<number>;
  }

  async getAdmins(chatId: number) {
    return this.rest.get('/getChatAdministrators', {
      query: {
        chat_id: chatId,
      },
    }) as Promise<APIChatMember[]>;
  }

  async leave(chatId: number) {
    return this.rest.post('/leaveChat', {
      body: { chat_id: chatId },
    }) as Promise<boolean>;
  }

  async setTitle(chatId: number, title: string) {
    return this.rest.post('/setChatTitle', {
      body: { chat_id: chatId, title },
    }) as Promise<boolean>;
  }

  async setDescription(chatId: number, description: string) {
    return this.rest.post('/setChatDescription', {
      body: { chat_id: chatId, description },
    }) as Promise<boolean>;
  }

  async setPhoto(chatId: number, photo: BufferResolvable) {
    const file = await resolveFile(photo);

    return this.rest.post('/setChatPhoto', {
      body: {
        chat_id: chatId,
      },
      files: [
        {
          key: 'photo',
          name: 'photo.jpg',
          ...file,
        },
      ],
    }) as Promise<boolean>;
  }

  async deletePhoto(chatId: number) {
    return this.rest.post('/deleteChatPhoto', {
      body: {
        chat_id: chatId,
      },
    }) as Promise<boolean>;
  }

  async sendMessage(
    chatId: number,
    text: string,
    options: APIMessageOptions = {}
  ) {
    return this.rest.post('/sendMessage', {
      body: {
        chat_id: chatId,
        text,
        ...options,
      },
    }) as Promise<APIMessage>;
  }

  async sendPhoto(
    chatId: number,
    photo: BufferResolvable,
    options: APIMediaMessageOptions = {}
  ) {
    const reqOptions = await prepareMediaRequest({
      body: {
        chat_id: chatId,
        ...options,
      },
      files: [{ name: 'photo.jpg', field: 'photo', file: photo }],
    });

    return this.rest.post('/sendPhoto', reqOptions) as Promise<APIMessage>;
  }

  async sendAudio(
    chatId: number,
    audio: BufferResolvable,
    options: APIAudioMessageOptions = {}
  ) {
    const reqOptions = await prepareMediaRequest({
      body: {
        chat_id: chatId,
        ...options,
      },
      files: [
        { name: 'audio.mp4', field: 'audio', file: audio },
        { name: 'thumbnail.jpg', field: 'thumbnail', download: true },
      ],
    });

    return this.rest.post('/sendAudio', reqOptions) as Promise<APIMessage>;
  }

  async sendDocument(
    chatId: number,
    document: BufferResolvable,
    options: APIDocumentMessageOptions = {}
  ) {
    const reqOptions = await prepareMediaRequest({
      body: {
        chat_id: chatId,
        ...options,
      },
      files: [
        { name: 'document', field: 'document', file: document },
        { name: 'thumbnail.jpg', field: 'thumbnail', download: true },
      ],
    });

    return this.rest.post('/sendDocument', reqOptions) as Promise<APIMessage>;
  }

  async sendVideo(
    chatId: number,
    video: BufferResolvable,
    options: APIVideoMessageOptions = {}
  ) {
    const reqOptions = await prepareMediaRequest({
      body: {
        chat_id: chatId,
        ...options,
      },
      files: [
        { name: 'video.mp4', field: 'video', file: video },
        { name: 'thumbnail.jpg', field: 'thumbnail', download: true },
        { name: 'cover.jpg', field: 'cover', download: true },
      ],
    });

    return this.rest.post('/sendVideo', reqOptions) as Promise<APIMessage>;
  }

  async sendAnimation(
    chatId: number,
    animation: BufferResolvable,
    options: APIAnimationMessageOptions = {}
  ) {
    const reqOptions = await prepareMediaRequest({
      body: {
        chat_id: chatId,
        ...options,
      },
      files: [
        { name: 'animation', field: 'animation', file: animation },
        { name: 'thumbnail.jpg', field: 'thumbnail', download: true },
      ],
    });

    return this.rest.post('/sendAnimation', reqOptions) as Promise<APIMessage>;
  }

  async sendVoice(
    chatId: number,
    voice: BufferResolvable,
    options: APIVoiceMessageOptions = {}
  ) {
    const reqOptions = await prepareMediaRequest({
      body: {
        chat_id: chatId,
        ...options,
      },
      files: [{ name: 'voice', field: 'voice', file: voice }],
    });

    return this.rest.post('/sendVoice', reqOptions) as Promise<APIMessage>;
  }

  async sendVideoNote(
    chatId: number,
    videoNote: BufferResolvable,
    options: APIVideoNoteMessageOptions = {}
  ) {
    const reqOptions = await prepareMediaRequest({
      body: {
        chat_id: chatId,
        ...options,
      },
      files: [{ name: 'video_note', field: 'video_note', file: videoNote }],
    });

    return this.rest.post('/sendVideoNote', reqOptions) as Promise<APIMessage>;
  }

  async sendAction(
    chatId: number,
    action: string,
    options: {
      threadId?: number;
      businessId?: number;
    } = {}
  ) {
    return this.rest.post('/sendChatAction', {
      body: {
        chat_id: chatId,
        action,
        message_thread_id: options.threadId,
        business_connection_id: options.businessId,
      },
    }) as Promise<boolean>;
  }

  async sendLocation(
    chatId: number,
    latitude: number,
    longitude: number,
    options: APILocationMessageOptions = {}
  ) {
    return this.rest.post('/sendLocation', {
      body: {
        chat_id: chatId,
        latitude,
        longitude,
        ...options,
      },
    }) as Promise<APIMessage>;
  }

  async sendVenue(
    { chatId, latitude, longitude, title, address }: APIVenueMessage,
    options: APIVenueMessageOptions = {}
  ) {
    return this.rest.post('/sendVenue', {
      body: {
        chat_id: chatId,
        latitude,
        longitude,
        title,
        address,
        ...options,
      },
    }) as Promise<APIMessage>;
  }

  async sendContact(
    chatId: number,
    phoneNumber: string,
    firstName: string,
    lastName: string,
    vcard?: string,
    options: APIContactMessageOptions = {}
  ) {
    return this.rest.post('/sendContact', {
      body: {
        chat_id: chatId,
        phone_number: phoneNumber,
        first_name: firstName,
        last_name: lastName,
        vcard,
        ...options,
      },
    }) as Promise<APIMessage>;
  }

  async sendPoll(
    chatId: number,
    question: string,
    options: APIPollOption[],
    messageOptions: APIPollMessageOptions = {}
  ) {
    return this.rest.post('/sendPoll', {
      body: {
        chat_id: chatId,
        question,
        options,
        ...messageOptions,
      },
    }) as Promise<APIMessage>;
  }

  async sendDice(
    chatId: number,
    emoji: APIDiceEmoji = '🎲',
    options: APIDiceMessageOptions = {}
  ) {
    return this.rest.post('/sendDice', {
      body: {
        chat_id: chatId,
        emoji,
        ...options,
      },
    }) as Promise<APIMessage>;
  }

  async setMessageReaction(
    chatId: number,
    messageId: number,
    reactions:
      | APIReactionTypeEmoji[]
      | APIReactionTypeCustomEmoji[]
      | APIReactionTypePaid[],
    isBig = false
  ) {
    return this.rest.post('/sendDice', {
      body: {
        chat_id: chatId,
        message_id: messageId,
        reaction: reactions,
        isBig,
      },
    }) as Promise<boolean>;
  }

  async banMember(
    chatId: number,
    userId: number,
    until_date?: number,
    deleteMessages?: boolean
  ) {
    const payload = {
      chat_id: chatId,
      user_id: userId,
      until_date,
      deleteMessages,
    };

    return this.rest.post('/banChatMember', {
      body: payload,
    }) as Promise<boolean>;
  }

  async unbanMember(chatId: number, userId: number, onlyIfBanned?: boolean) {
    return this.rest.post('/unbanChatMember', {
      body: {
        chat_id: chatId,
        user_id: userId,
        only_if_banned: onlyIfBanned,
      },
    }) as Promise<boolean>;
  }

  async restrictMember(
    chatId: number,
    userId: number,
    permissions: APIChatPermissions[],
    untilDate?: number
  ) {
    return this.rest.post('/restrictChatMember', {
      body: {
        chat_id: chatId,
        user_id: userId,
        permissions,
        until_date: untilDate,
      },
    }) as Promise<boolean>;
  }

  async promoteMember(
    chatId: number,
    userId: number,
    permissions: Partial<Record<APIChatPermissions, boolean>>,
    isAnonymous = false
  ) {
    return this.rest.post('/promoteChatMember', {
      body: {
        chat_id: chatId,
        user_id: userId,
        is_anonymous: isAnonymous,
        ...permissions,
      },
    }) as Promise<boolean>;
  }

  async setAdminTitle(chatId: number, userId: number, title: string) {
    return this.rest.post('/setChatAdministratorCustomTitle', {
      body: {
        chat_id: chatId,
        user_id: userId,
        custom_title: title,
      },
    }) as Promise<boolean>;
  }

  async banSenderChat(chatId: number | string, senderChatId: number) {
    return this.rest.post('/banChatSenderChat', {
      body: {
        chat_id: chatId,
        sender_chat_id: senderChatId,
      },
    }) as Promise<boolean>;
  }

  async unbanSenderChat(chatId: number | string, senderChatId: number) {
    return this.rest.post('/banChatSenderChat', {
      body: {
        chat_id: chatId,
        sender_chat_id: senderChatId,
      },
    }) as Promise<boolean>;
  }

  setPermissions(
    chatId: number,
    permissions: Partial<Record<APIChatPermissions, boolean>>,
    independent = false
  ) {
    return this.rest.post('/setChatPermissions', {
      body: {
        chat_id: chatId,
        permissions,
        use_independent_chat_permissions: independent,
      },
    }) as Promise<boolean>;
  }

  async getInviteLink(chatId: number) {
    return this.rest.get('/exportChatInviteLink', {
      query: {
        chat_id: chatId,
      },
    }) as Promise<string>;
  }

  async createInviteLink(chatId: number, options: APICreateChatLinkOptions) {
    return this.rest.post('/createChatInviteLink', {
      body: {
        chat_id: chatId,
        ...options,
      },
    }) as Promise<APIChatInviteLink>;
  }

  async editInviteLink(
    chatId: number,
    link: string,
    options: APICreateChatLinkOptions
  ) {
    return this.rest.post('/editChatInviteLink', {
      body: {
        chat_id: chatId,
        invite_link: link,
        ...options,
      },
    }) as Promise<APIChatInviteLink>;
  }

  async createSubscriptionInviteLink(
    chatId: number,
    period: number,
    price: number,
    name?: string
  ) {
    return this.rest.post('/createChatSubscriptionInviteLink', {
      body: {
        chat_id: chatId,
        subscription_period: period,
        subscription_price: price,
        name,
      },
    }) as Promise<APIChatInviteLink>;
  }

  async editSubscriptionInviteLink(
    chatId: number,
    link: string,
    name?: string
  ) {
    return this.rest.post('/editChatSubscriptionInviteLink', {
      body: {
        chat_id: chatId,
        invite_link: link,
        name,
      },
    }) as Promise<APIChatInviteLink>;
  }

  async revokeInviteLink(chatId: number, link: string) {
    return this.rest.post('/revokeInviteLink', {
      body: {
        chat_id: chatId,
        invite_link: link,
      },
    }) as Promise<APIChatInviteLink>;
  }

  async approveJoinRequest(chatId: number, userId: number) {
    return this.rest.post('/approveChatJoinRequest', {
      body: {
        chat_id: chatId,
        userId,
      },
    }) as Promise<boolean>;
  }

  async declineJoinRequest(chatId: number, userId: number) {
    return this.rest.post('/declineChatJoinRequest', {
      body: {
        chat_id: chatId,
        userId,
      },
    }) as Promise<boolean>;
  }

  async pinMessage(
    chatId: number,
    messageId: number,
    silent = false,
    businessConnectionId?: string
  ) {
    return this.rest.post('/pinChatMessage', {
      body: {
        chat_id: chatId,
        message_id: messageId,
        disable_notification: silent,
        business_connection_id: businessConnectionId,
      },
    }) as Promise<boolean>;
  }

  async unpinMessage(
    chatId: number,
    messageId: number,
    businessConnectionId?: string
  ) {
    return this.rest.post('/unpinChatMessage', {
      body: {
        chat_id: chatId,
        message_id: messageId,
        business_connection_id: businessConnectionId,
      },
    }) as Promise<boolean>;
  }

  async unpinAllMessages(chatId: number) {
    return this.rest.post('/unpinAllChatMessages', {
      body: {
        chat_id: chatId,
      },
    }) as Promise<boolean>;
  }

  async forwardMessage(
    messageId: number,
    fromChatId: number,
    toChatId: number,
    options: APIForwardMessageOptions
  ) {
    return this.rest.post('/forwardMessage', {
      body: {
        message_id: messageId,
        from_chat_id: fromChatId,
        chat_id: toChatId,
        ...options,
      },
    }) as Promise<APIMessage>;
  }

  async forwardMessages(
    messageIds: number[],
    fromChatId: number,
    toChatId: number,
    options: APIForwardMessageOptions
  ) {
    return this.rest.post('/forwardMessages', {
      body: {
        message_ids: messageIds,
        from_chat_id: fromChatId,
        chat_id: toChatId,
        ...options,
      },
    });
  }

  async copyMessage(
    messageId: number,
    fromChatId: number,
    toChatId: number,
    options: APICopyMessageOptions
  ) {
    return this.rest.post('/copyMessage', {
      body: {
        message_id: messageId,
        from_chat_id: fromChatId,
        chat_id: toChatId,
        ...options,
      },
    });
  }

  async copyMessages(
    messageIds: number[],
    fromChatId: number,
    toChatId: number,
    options: APICopyMessageOptions
  ) {
    return this.rest.post('/copyMessage', {
      body: {
        message_ids: messageIds,
        from_chat_id: fromChatId,
        chat_id: toChatId,
        ...options,
      },
    });
  }

  async setStickerSet(chatId: number, name: string) {
    return this.rest.post('/setChatStickerSet', {
      body: {
        chat_id: chatId,
        name,
      },
    }) as Promise<boolean>;
  }

  async deleteStickerSet(chatId: number) {
    return this.rest.post('/deleteChatStickerSet', {
      body: {
        chat_id: chatId,
      },
    }) as Promise<boolean>;
  }
}
