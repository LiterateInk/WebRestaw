import { type WebRestoFetcher, defaultWebRestoFetcher } from "~/utils/fetcher";

import { callWrApiAuth } from "~/api/auth";
import { callWrApiQrCode } from "~/api/qrcode";

import { Session } from "~/parsers/session";

class WebResto {
  public static async createSession (username: string, password: string, fetcher = defaultWebRestoFetcher): Promise<WebResto> {
    const auth = await callWrApiAuth({
      username, password, fetcher
    });

    const session = new Session(auth);
    return new WebResto(session, fetcher);
  }

  readonly #session: Session;
  public fetcher: WebRestoFetcher;

  public constructor (session: Session, fetcher = defaultWebRestoFetcher) {
    this.#session = session;
    this.fetcher = fetcher;
  }

  /**
   * Internal session, used to make
   * authenticated requests.
   */
  public get session (): Session {
    return this.#session;
  }

  /**
   * @returns QR code image as a PNG buffer.
   */
  public async getQrCode (): Promise<ArrayBuffer> {
    const png = await callWrApiQrCode({
      session: this.#session,
      fetcher: this.fetcher
    });

    return png;
  }
}

export default WebResto;
