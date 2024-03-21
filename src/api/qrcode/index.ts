import { APP_ENDPOINT, createAuthenticatedEndpoint } from "~/webresto/constants";
import type { WebRestoApiQrCodeReq } from "./types";
import { readRedirectionURL } from "~/webresto/wajax";
import { findValueBetween } from "~/utils/finder";

export const callWrApiQrCode = async (input: WebRestoApiQrCodeReq): Promise<ArrayBuffer> => {
  const url = createAuthenticatedEndpoint(input.session.id);
  const data = new URLSearchParams();
  data.set("WD_ACTION_", "AJAXPAGE");
  data.set("EXECUTE", "16");
  data.set("WD_CONTEXTE_", "A35");

  const middleware = await input.fetcher(url, {
    method: "POST",
    body: data.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: input.session.cookies.join("; ")
    }
  });

  const middlewarePlainXML = await middleware.text();
  const redirectionURL = readRedirectionURL(middlewarePlainXML);

  const qrCode = await input.fetcher(redirectionURL.href, {
    method: "GET",
    headers: {
      Cookie: input.session.cookies.join("; ")
    }
  });

  const qrCodePlainHTML = await qrCode.text();
  let imgSrcAttribute = findValueBetween(qrCodePlainHTML, "<img src=\"", "\"");
  // Replace "&" HTML entity with its actual character.
  imgSrcAttribute = imgSrcAttribute.replace(/&amp;/g, "&");

  const qrCodeImageURL = new URL(imgSrcAttribute, APP_ENDPOINT).href;

  const qrCodeImage = await input.fetcher(qrCodeImageURL, {
    method: "GET",
    headers: {
      Cookie: input.session.cookies.join("; ")
    }
  });

  return qrCodeImage.arrayBuffer();
};
