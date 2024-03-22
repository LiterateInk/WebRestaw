import type { WebRestoApiAuthReq, WebRestoApiAuthRes } from "./types";

import { APP_ENDPOINT } from "~/webresto/constants";
import { readRedirectionURL } from "~/webresto/wajax";

import { retrieveResponseCookies } from "~/utils/headers";
import { findValueBetween } from "~/utils/finder";

export const callWrApiAuth = async (input: WebRestoApiAuthReq): Promise<WebRestoApiAuthRes> => {
  const home = await input.fetcher(APP_ENDPOINT, { method: "GET" });
  if (home.status !== 200) {
    if (home.status === 503) throw new Error("Service unavailable, this happens most of the time when you're rate-limited. You should wait and try again later.");
    throw new Error("Failed to fetch the service for an unknown reason.");
  }

  const sessionCookies = retrieveResponseCookies(home.headers);

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
      Cookie: sessionCookies.join("; ")
    }
  });

  const authPlainXML = await auth.text();

  // Handle possible errors.
  if (authPlainXML.includes("alert('Echec de l")) {
    throw new Error("Login failed, happens most of the time when bad credentials were given.");
  }

  const redirectionURL = readRedirectionURL(authPlainXML);
  const sessionID = redirectionURL.pathname.split("/").pop();
  if (!sessionID) throw new Error("Session ID not found.");

  return { cookies: sessionCookies, id: sessionID };
};
