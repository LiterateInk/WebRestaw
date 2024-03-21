import { APP_ENDPOINT } from "~/webresto/constants";
import type { WebRestoApiAuthReq, WebRestoApiAuthRes } from "./types";
import { retrieveResponseCookies } from "~/utils/headers";
import { findValueBetween } from "~/utils/finder";
import { readRedirectionURL } from "~/webresto/wajax";

export const callWrApiAuth = async (input: WebRestoApiAuthReq): Promise<WebRestoApiAuthRes> => {
  const home = await input.fetcher(APP_ENDPOINT, { method: "GET" });

  // Read cookies from the response.
  const cookies = retrieveResponseCookies(home.headers);

  const homePlainHTML = await home.text();
  const actionAttributeValue = findValueBetween(homePlainHTML, "<form name=\"PAGE_LOGIN\" action=\"", "\"");
  const actionURL = new URL(actionAttributeValue, APP_ENDPOINT).href;

  const data = new URLSearchParams();
  data.set("WD_ACTION_", "AJAXPAGE");
  data.set("EXECUTE", "16");
  data.set("WD_CONTEXTE_", "A25");
  data.set("A27", input.username);
  data.set("A28", input.password);

  const auth = await input.fetcher(actionURL, {
    method: "POST",
    body: data.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookies.join("; ")
    }
  });

  const authPlainXML = await auth.text();
  const redirectionURL = readRedirectionURL(authPlainXML);
  const sessionID = redirectionURL.pathname.split("/").pop();
  if (!sessionID) throw new Error("Session ID not found.");

  return { cookies, id: sessionID };
};
