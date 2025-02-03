import { REST } from '../REST.js';
import { APIMediaPhoto } from './structures/media.js';
import { APIUser, APIUserProfilePhotos } from './structures/user.js';

export class ChatsAPI {
  public constructor(private readonly rest: REST) {}

  public async getCurrent(): Promise<APIUser> {
    return this.rest.get('/getMe').then((data) => new APIUser(data));
  }

  public async getProfilePhotos(
    userId: number,
    offset?: number,
    limit?: number
  ): Promise<APIUserProfilePhotos> {
    const response = await this.rest.get('/getUserProfilePhotos', {
      query: {
        user_id: userId,
        offset,
        limit,
      },
    });
    const finalResponse: APIUserProfilePhotos = {
      totalCount: response.total_count,
      photos: [],
    };

    for (const photo of response.photos.flat()) {
      finalResponse.photos.push(new APIMediaPhoto(photo));
    }

    return finalResponse;
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
