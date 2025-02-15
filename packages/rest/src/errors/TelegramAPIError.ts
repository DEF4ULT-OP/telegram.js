import { InternalRequest, RawFile } from '../utils/types.js';

export interface TelegramAPIErrorData {
  ok: boolean;
  error_code: number;
  description: string;
  parameters?: {
    retry_after: number;
  };
}

export interface RequestBody {
  files: RawFile[] | undefined;
  json: unknown | undefined;
}

export class TelegramAPIError extends Error {
  public requestBody: RequestBody;

  /**
   * @param rawError - The error reported by Discord
   * @param code - The error code reported by Discord
   * @param status - The status code of the response
   * @param method - The method of the request that erred
   * @param url - The url of the request that erred
   * @param bodyData - The unparsed data for the request that errored
   */
  public constructor(
    public rawError: TelegramAPIErrorData,
    public code: number | string,
    public status: number,
    public method: string,
    public url: string,
    bodyData: Pick<InternalRequest, 'body' | 'files'>
  ) {
    super(TelegramAPIError.getMessage(rawError));

    this.requestBody = { files: bodyData.files, json: bodyData.body };
  }

  /**
   * The name of the error
   */
  public override get name(): string {
    return `${TelegramAPIError.name}[${this.code}]`;
  }

  private static getMessage(error: TelegramAPIErrorData) {
    return error.description ?? 'No Description';
  }
}
