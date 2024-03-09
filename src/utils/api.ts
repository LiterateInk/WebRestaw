import type { WebRestoFetcher } from "~/utils/fetcher";

export interface WebRestoApiReq {
  fetcher: WebRestoFetcher
  cookies: string[]
}
