import fs from "node:fs";
import path from "node:path";

export const templateHandler = (name: string, format: "html" | "json") => async (): Promise<string> => {
  const templatePath = path.join(__dirname, "templates", `${name}.${format}`);
  return fs.readFileSync(templatePath, "utf8");
};

export const emptyArrayBufferHandler = async (): Promise<ArrayBuffer> => new ArrayBuffer(0);
export const emptyTextHandler = async (): Promise<string> => "";

export const wajaxRedirHandler = (path: string) => async () => `<?xml version="1.0" encoding="utf-8" ?><WAJAX><REDIR>${path}</REDIR></WAJAX>`;
export const wajaxErrorHandler = (message: string) => async () => `<?xml version="1.0" encoding="utf-8" ?><WAJAX><JS>alert('${message}')</JS></WAJAX>`;

export const LOGIN_SESSION_ID = "2AMAAAAAAAAKAA";
export const LOGIN_SECURITY_COOKIE = { DYN_SECURITE6969: "BF9A8270057624FD2AD0" };

export class FetcherMockError extends Error {
  public constructor (message: string) {
    super(message);
    this.name = "MockError";
  }
}
