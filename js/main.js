import { UI_ELEMENTS, renderMessage, sendMessageUI } from "./view.js";
import { popupActivated } from "./popup.js";
import Cookies from "js-cookie";

popupActivated();

const URL = "mighty-cove-31255.herokuapp.com";
const socket = new WebSocket(`ws://${URL}/websockets?${Cookies.get("token")}`);

startChat();
async function startChat() {
  await renderHistory();
  socketConnect();
  sendMessageUI();
}

export function getCode() {
  const userMail = UI_ELEMENTS.AUTHORIZATION_MAIL_INPUT.value;
  if (userMail) {
    const email = {
      email: userMail,
    };
    const json = email ? JSON.stringify(email) : false;
    loadMail(json);
  } else {
    alert("введите корректную почту");
  }
}

export async function enterCode() {
  const userCode = UI_ELEMENTS.AUTHORIZATION_CODE_INPUT.value;
  if (userCode) {
    Cookies.set("token", userCode);
    const response = await fetch(`https://${URL}/api/user`, {
      method: "PATCH",
      body: JSON.stringify({ name: "Alex" }),
      headers: {
        "Content-type": "application/json;charset=utf-8",
        Authorization: `bearer ${Cookies.get("token")}`,
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

async function renderHistory() {
  try {
    const response = await fetch(`https://${URL}/api/messages`, {
      method: "GET",
    });
    const messages = await response.json();
    console.log("[history] история сообщений загружена");
    const lastMessage = messages.messages.length;
    const count = 30;

    for (let i = lastMessage - count; i < lastMessage; i++) {
      const text = messages.messages[i].text;
      const name = messages.messages[i].user.name;
      const time = messages.messages[i].createdAt;
      renderMessage(text, name, time);
    }
  } catch (err) {
    console.log(err);
  }
}

function socketConnect() {
  console.log("[socket] первичное соединение установлено");

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log(data);
    renderMessage(data.text, data.user.name, data.createdAt);
  };
}

export function sendMessage(text) {
  console.log("[socket] отправка сообщения");
  if (text) {
    socket.send(
      JSON.stringify({
        text: text,
      })
    );
  } else {
    console.log("[socket] сообщение пустое");
  }
}

async function loadMail(email) {
  await fetch(`https://${URL}/api/user`, {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8",
    },
    body: email,
  });
}

