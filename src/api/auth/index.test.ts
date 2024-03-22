import { emptyArrayBufferHandler, wajaxRedirHandler, LOGIN_SESSION_ID, LOGIN_SECURITY_COOKIE, wajaxErrorHandler, templateHandler, FetcherMockError } from "@webrestaw/mock";
import { describe, test, expect } from "bun:test";
import { callWrApiAuth } from ".";

import type { WebRestoFetcher } from "~/utils/fetcher";
import { WebRestoSession } from "~/constants/session";
import { APP_ENDPOINT } from "~/webresto/constants";

// Extracted from the `PAGE_LOGIN.html` mock template.
const APP_LOGIN_ENDPOINT = new URL("/Webresto_V25/PAGE_Login/BBEAAG1K3xgLAELTuGlpIXfE3lU", APP_ENDPOINT).href;

const rateLimitedFetcher: WebRestoFetcher = async (url, options) => {
  return {
    status: 503,
    headers: {},
    arrayBuffer: emptyArrayBufferHandler,
    text: templateHandler("_ERROR_UNAVAILABLE", "html")
  };
};

const notRateLimitedFetcher: WebRestoFetcher = async (url, options) => {
  if (url === APP_ENDPOINT) { // first request is a GET to the home page
    return {
      status: 200,
      headers: {}, // TODO: add `Set-Cookie` header for DYN_SECURITE6969
      arrayBuffer: emptyArrayBufferHandler,
      text: templateHandler("PAGE_LOGIN", "html")
    };
  }
  else if (url === APP_LOGIN_ENDPOINT) { // second request is a POST to the login form
    const params = new URLSearchParams(options.body!);
    const username = params.get("A27");
    const password = params.get("A28");

    // check if correct credentials were given
    if (username === "test" && password === "test") {
      // if the cookie is not given
      // if (!("DYN_SECURITE6969" in (options.headers ?? {}))) {
      //   return {
      //     status: 200,
      //     headers: LOGIN_SECURITY_COOKIE,
      //     arrayBuffer: emptyArrayBufferHandler,
      //     text: wajaxErrorHandler("Echec de l\x27authentification !")
      //   };
      // }

      return {
        status: 200,
        headers: {},
        arrayBuffer: emptyArrayBufferHandler,
        text: wajaxRedirHandler(`/Webresto_V25/PAGE_CLIENT_MENU_V2/${LOGIN_SESSION_ID}?WD_ACTION_=REFRESH`)
      };
    }
    // check if bad credentials were given
    else if (username === "bad" && password === "credentials") {
      return {
        status: 200,
        headers: LOGIN_SECURITY_COOKIE,
        arrayBuffer: emptyArrayBufferHandler,
        text: wajaxErrorHandler("Echec de l\x27authentification !")
      };
    }
    else {
      throw new FetcherMockError("Unknown credentials were given.");
    }
  }

  throw new FetcherMockError(`Unknown URL: '${url}'.`);
};

describe("api/auth", () => {
  test("should NOT authenticate with the bad credentials", async () => {
    const authenticate = () => callWrApiAuth({
      username: "bad",
      password: "credentials",
      fetcher: notRateLimitedFetcher
    });

    expect(authenticate).not.toThrow(FetcherMockError);
    expect(authenticate).toThrow(Error);
  });

  test("should authenticate with the correct credentials", async () => {
    let session: WebRestoSession | undefined;

    try {
      session = await callWrApiAuth({
        username: "test",
        password: "test",
        fetcher: notRateLimitedFetcher
      });
    }
    catch (error) {
      // only show errors from the mock
      if (error instanceof FetcherMockError) {
        throw error;
      }
    }

    expect(session).not.toBeUndefined();
    expect(session!.id).toBe(LOGIN_SESSION_ID);
    expect(session!.cookies).toEqual([]);
  });

  test("should handle rate limits", async () => {
    const authenticate = () => callWrApiAuth({
      username: "test",
      password: "test",
      fetcher: rateLimitedFetcher
    });

    expect(authenticate).not.toThrow(FetcherMockError);
    expect(authenticate).toThrow(Error);
  });
});
