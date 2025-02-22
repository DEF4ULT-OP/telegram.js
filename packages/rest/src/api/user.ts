import { REST } from '../REST.js';
import { APIUser, APIUserProfilePhotos } from './interfaces/user.js';
export class UsersAPI {
  public constructor(private readonly rest: REST) {}

  public async getCurrent() {
    return this.rest.get('/getMe') as Promise<APIUser>;
  }

  public async getProfilePhotos(
    userId: number,
    offset?: number,
    limit?: number
  ) {
    return this.rest.get('/getUserProfilePhotos', {
      query: {
        user_id: userId,
        offset,
        limit,
      },
    }) as Promise<APIUserProfilePhotos>;
  }

  public async setEmojiStatus(
    userId: number,
    emojiId?: string,
    expiryDate?: Date
  ): Promise<boolean> {
    const payload: any = {
      user_id: userId,
    };

    if (emojiId) {
      payload['emoji_status_custom_emoji_id'] = emojiId;
    }

    if (expiryDate) {
      payload['emoji_status_expiration_date'] = +new Date(expiryDate);
    }

    return this.rest.post('/setUserEmojiStatus', {
      body: payload,
    });
  }
}
