import type { WebRestoSession } from "~/constants/session";
import type { WebRestoApiReq } from "~/utils/api";

export interface WebRestoApiAuthReq extends WebRestoApiReq {
  username: string;
  password: string;
}

export type WebRestoApiAuthRes = WebRestoSession;
