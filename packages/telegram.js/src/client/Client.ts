import { ErrorCodes } from '../errors/errorCodes.js';
import { TelegramjsError } from '../errors/TJSError.js';
import { ChatManager } from '../managers/ChatManager.js';
import { UserManager } from '../managers/UserManager.js';
import { User } from '../structures/User.js';
import { Events, ClientStatus } from '../util/constants.js';
import { ClientOptions } from '../util/options.js';
import { BaseClient } from './BaseClient.js';
import { PollingClient } from './PollingClient.js';
import { UpdaterClient } from './UpdateClient.js';

/**
 * The main hub for interacting with the Telegram API, and the starting point for any bot.
 * @extends {BaseClient}
 */
export class Client extends BaseClient {
  #token: string | null | undefined;
  public status: ClientStatus;
  public user: User | null;
  public readonly polling: PollingClient;
  public readonly updater: UpdaterClient;

  public readonly users: UserManager;
  public readonly chats: ChatManager;

  constructor(options: Partial<ClientOptions> = {}) {
    super(options);

    this.#token = null;
    this.user = null;
    this.status = ClientStatus.Idle;

    if (!this.#token && 'TELEGRAM_TOKEN' in process.env) {
      this.#token = process.env.TELEGRAM_TOKEN;
    }

    this.polling = new PollingClient(this);
    this.updater = new UpdaterClient(this);

    this.users = new UserManager(this);

    this.chats = new ChatManager(this);
  }

  /**
   * Logs the client in, establishing a WebSocket connection to Discord.
   * @param {string} [token=this.token] Token of the account to log in with
   * @returns {Promise<string>} Token of the account used
   * @example
   * client.login('my token');
   */
  async login(token: string | null | undefined = this.#token): Promise<string> {
    if (!token || typeof token !== 'string')
      throw new TelegramjsError(ErrorCodes.InvalidToken);

    this.#token = token;
    this.rest.setToken(this.#token);

    this.emit(Events.Debug, `Provided token: ${this._censoredToken}`);

    await this.loadClientUser();

    this.polling.start();
    this.emit(Events.Ready);

    return this.#token;
  }

  async loadClientUser() {
    const data = await this.api.users.getCurrent();

    const clientUser = this.users._add(data, false);

    this.user = clientUser;
  }
  /**
   * Returns whether the client has logged in, indicative of being able to access
   * @returns {boolean}
   */
  isReady(): boolean {
    return this.status === ClientStatus.Ready;
  }

  /**
   * Logs out, terminates the connection to Discord, and destroys the client.
   * @returns {Promise<void>}
   */
  override async destroy(): Promise<void> {
    super.destroy();
    this.#token = null;
    this.rest.setToken(null);
  }

  get _censoredToken() {
    if (!this.#token) return null;

    return this.#token
      .split(':')
      .map((val, i) => (i > 1 ? val.replace(/./g, '*') : val))
      .join('.');
  }
}
