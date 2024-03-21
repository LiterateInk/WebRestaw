import type { WebRestoSession } from "~/constants/session";

export class Session {
  readonly #id: string;
  readonly #cookies: string[];

  public constructor (session: WebRestoSession) {
    this.#id = session.id;
    this.#cookies = session.cookies;
  }

  public get id (): string {
    return this.#id;
  }

  public get cookies (): string[] {
    return this.#cookies;
  }
}
