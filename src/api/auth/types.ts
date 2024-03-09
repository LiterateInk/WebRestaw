import type { WebRestoApiReq } from "~/utils/api";

export interface WebRestoApiAuthReq extends WebRestoApiReq {
  username: string;
  password: string;
}

export interface WebRestoApiAuthRes {
  sessionID: string;
  cookies: string[];
}
