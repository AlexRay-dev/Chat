import { URL } from "./main.js";
import { getValidJson, getToken } from "./utils.js";

const contentType = "application/json;charset=utf-8";

export function getCode() {
  const userMail = UI_ELEMENTS.AUTHORIZATION_MAIL_INPUT.value;
  if (userMail) {
    const email = {
      email: userMail,
    };
    const json = getValidJson("stringify", email);
    loadMail(json);
  } else {
    alert("введите корректную почту");
  }
}

export async function enterCode() {
  const userCode = UI_ELEMENTS.AUTHORIZATION_CODE_INPUT.value;
  if (userCode) {
    Cookies.set("token", userCode);
    const name = {
      name: "Alex",
    };
    const response = await fetch(`https://${URL}/api/user`, {
      method: "PATCH",
      body: getValidJson("stringify", name),
      headers: {
        "Content-type": contentType,
        Authorization: `bearer ${getToken()}`,
      },
    });
    console.log("После ввода кода: " + response);
    // fetch('https://mighty-cove-31255.herokuapp.com/api/user/me', {
    //   method: "GET",
    // //   body: JSON.stringify({ name: "Alex" }),
    //   headers: {
    //     "Content-type": "application/json;charset=utf-8",
    //     Authorization: `bearer ${Cookies.get("token")}`,
    //   },
    // });
  }
}
getHistory();

async function getHistory() {
  try {
    const response = await fetch(`https://${URL}/api/messages`, {
      method: "GET",
    });
    const json = await response.json();
    const history = json.messages;
    localStorage.setItem("history", getValidJson("stringify", history));

    console.log("[history] история сообщений загружена");
  } catch (error) {
    alert(error);
  }
}

async function loadMail(email) {
  try {
    await fetch(`https://${URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-type": contentType,
      },
      body: email,
    });
  } catch (err) {
    alert(err);
  }
}
