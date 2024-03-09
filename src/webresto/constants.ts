export const APP_ENDPOINT = "https://web-resto.fr/Webresto_V25";
export const APP_MAIN_PAGE = "PAGE_CLIENT_MENU_V2";

export const createAuthenticatedEndpoint = (sessionID: string) => `${APP_ENDPOINT}/${APP_MAIN_PAGE}/${sessionID}`;
