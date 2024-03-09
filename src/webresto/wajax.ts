import { APP_ENDPOINT } from "~/webresto/constants";
import { findValueBetween } from "~/utils/finder";

const REDIRECTION_URL_START = "<WAJAX><REDIR>";
const REDIRECTION_URL_END = "</REDIR></WAJAX>";

export const readRedirectionURL = (plain: string): URL => {
  const path = findValueBetween(plain, REDIRECTION_URL_START, REDIRECTION_URL_END);
  return new URL(path, APP_ENDPOINT);
};
