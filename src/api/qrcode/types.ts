import type { WebRestoApiReq } from "~/utils/api";

export interface WebRestoApiQrCodeReq extends WebRestoApiReq {
  sessionID: string;
  cookies: string[];
}

export interface WebRestoApiQrCodeRes {

}
