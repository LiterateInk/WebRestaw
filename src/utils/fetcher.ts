export type WebRestoFetcherHeaders = Record<string, string> | Headers;

/**
 * A fetcher that looks like the Fetch API
 * so every fetcher applied to WebRestaw will have the
 * same API and should output the same thing.
 *
 * @example
 * import type { WebRestoFetcher } from "webrestaw";
 *
 * // With the `fetch()` builtin, in TypeScript.
 * // This is actually the code for the default fetcher.
 * const fetcher: WebRestoFetcher = async (url, options) => {
 *   const response = await fetch(url, {
 *     method: options.method,
 *     headers: options.headers,
 *     // Setting a body is not allowed on GET requests.
 *     body: (options.method === "GET") ? void 0 : options.body
 *   });
 *
 *   return {
 *     headers: response.headers,
 *     text: () => response.text(),
 *     json: <T>() => response.json() as T,
 *     arrayBuffer: () => response.arrayBuffer()
 *   };
 * };
 */
export type WebRestoFetcher = (url: string, options: {
  method: "GET" | "POST"
  /** Headers that should be appended to the request. */
  headers?: WebRestoFetcherHeaders
  /** Body of the request, always as string. */
  body?: string
}) => Promise<{
  headers: WebRestoFetcherHeaders
  text: () => Promise<string>
  json: <T>() => Promise<T>
  arrayBuffer: () => Promise<ArrayBuffer>
}>;

/**
 * Simple and default fetcher using `fetch` if none was given
 * in the initializer function.
 */
export const defaultWebRestoFetcher: WebRestoFetcher = async (url, options) => {
  const response = await fetch(url, {
    method: options.method,
    headers: options.headers,
    // Setting a body is not allowed on GET requests.
    body: (options.method === "GET") ? void 0 : options.body
  });

  return {
    headers: response.headers,
    text: () => response.text(),
    json: <T>() => response.json() as T,
    arrayBuffer: () => response.arrayBuffer()
  };
};
