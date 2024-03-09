import type { WebRestoFetcherHeaders } from "./fetcher";
import { splitCookiesString } from "set-cookie-parser";

export const retrieveResponseCookies = (headers: WebRestoFetcherHeaders): string[] => {
  let setCookies: string[] = [];

  // On latest JS, `getSetCookie` is a function that returns `set-cookie` as an array.
  if (typeof headers.getSetCookie === "function") {
    setCookies = headers.getSetCookie();
  }
  else {
    let setCookiesString: string | undefined | null;

    // Before, we had to use `get` to get the `set-cookie` header.
    if (typeof headers.get === "function") {
      setCookiesString = headers.get("set-cookie");
    }
    // When we get an object, check the key `set-cookie`.
    // On some engines, the headers name are lowercase.
    else if ("set-cookie" in headers) {
      setCookiesString = headers["set-cookie"];
    }
    // When it's not lowercase, we have to find the key ourselves.
    else {
      const key = Object.keys(headers).find((key) => key.toLowerCase() === "set-cookie");
      if (key) setCookiesString = headers[key as keyof typeof headers] as string | undefined;
    }

    if (setCookiesString) setCookies = splitCookiesString(setCookiesString);
  }

  // Reassemble the cookies in the `name=value` format.
  const cookies = setCookies.map((c) => c.split(";")[0]);
  return cookies;
};
