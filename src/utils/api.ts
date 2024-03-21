import type { WebRestoSession } from "~/constants/session";
import type { WebRestoFetcher } from "~/utils/fetcher";

export interface WebRestoApiReq {
  fetcher: WebRestoFetcher
}

export interface WebRestoApiReqWithSession extends WebRestoApiReq {
  session: WebRestoSession
}
