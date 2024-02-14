// TO EDIT !!!
const USERNAME = "user";
const PASSWORD = "pwd";

// reimplement internal functions
function convertToIntegerWithPadding(n: number, pad: number, radix = 10) {
  const result = typeof n === "number" ? n.toString(radix) : String(n);
  return addZeroPadding(result, pad)
}

function addZeroPadding(n: string, pad: number) {
  for (let i = pad - n.length; 0 < i; i--) {
    n = "0" + n;
  }

  return n;
}

const sGetDateHeureWL = (time: Date, isDate: boolean) => {
  let result = "";

  if (isDate) {
    result += convertToIntegerWithPadding(time.getFullYear(), 4);
    result += convertToIntegerWithPadding(time.getMonth() + 1, 2);
    result += convertToIntegerWithPadding(time.getDate(), 2);
  }
  else {
    result += convertToIntegerWithPadding(time.getHours(), 2);
    result += convertToIntegerWithPadding(time.getMinutes(), 2);
    result += convertToIntegerWithPadding(time.getSeconds(), 2);
    result += convertToIntegerWithPadding(time.getMilliseconds(), 3);
  }

  return result
}

(async () => {
  const UA_HEADER = { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36" };
  const ENDPOINT = "https://web-resto.fr/Webresto_V25";

  const response_home = await fetch(`${ENDPOINT}`, {
    method: "GET",
    headers: UA_HEADER
  });

  const home_html = await response_home.text();

  // Cookiejar for the response of requests.
  let cookies: string[] = [];

  // Get the cookies from the home response.
  response_home.headers.get("set-cookie")?.split(",").forEach((cookie) => {
    cookies.push(cookie.trim().split(";")[0]);
  });

  const start_strip = "<form name=\"PAGE_LOGIN\" action=\"";
  const start_strip_index = home_html.indexOf(start_strip) + start_strip.length;
  const end_strip_index = home_html.indexOf("\"", start_strip_index); 
  
  const auth_path = home_html.slice(start_strip_index, end_strip_index);
  const auth_url = new URL(auth_path, ENDPOINT);

  const auth_data = new URLSearchParams();
  auth_data.set("WD_ACTION_", "AJAXPAGE");
  auth_data.set("EXECUTE", "16");
  auth_data.set("WD_CONTEXTE_", "A25");
  auth_data.set("WD_JSON_PROPRIETE_", JSON.stringify({
    m_oProprietesSecurisees: {
      "A49": {
        "118": 4
      }
    },
    m_oVariablesProjet: {},
    m_oVariablesPage: {
      PAGE_LOGIN: {
        gbBsourisendehors: "false"
      }
    }
  }));
  auth_data.set("WD_BUTTON_CLICK_", "");
  auth_data.set("A5", "2");
  auth_data.set("A19", "");
  auth_data.set("A20", "");
  auth_data.set("A27", USERNAME);
  auth_data.set("A28", PASSWORD);
  auth_data.set("A34", "");
  auth_data.set("A35", "");
  auth_data.set("A26", "");
  auth_data.set("A39", "");
  

  let Webresto_FamilleCookie = encodeURIComponent(`1,1,,${USERNAME},${PASSWORD},${sGetDateHeureWL(new Date(), true)},${sGetDateHeureWL(new Date(), false)}`);
  cookies.push(`Webresto_Famille=${Webresto_FamilleCookie}`);

  const response_auth = await fetch(auth_url.href, {
    method: "POST",
    body: auth_data.toString(),
    headers: {
      ...UA_HEADER,
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookies.join("; ")
    }
  });

  const response_text = await response_auth.text();
  console.log("SET-COOKIES\n---\n" + response_auth.headers.get("set-cookie") ?? "(rien)");
  console.log("\nSTATUS\n---\n" + response_auth.status.toString());
  console.log("\nCONTENT\n---\n" + response_text);
})();