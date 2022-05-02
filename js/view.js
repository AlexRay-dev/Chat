import { format } from "date-fns";
import { parseISO } from "date-fns/esm";
import Cookies from "js-cookie";

export const UI_ELEMENTS = {
  DIALOG_INPUT: document.querySelector(".dialog__message-input"),
  DIALOG_SUBMIT: document.querySelector(".dialog__message-submit"),
  MESSAGE_TEMPLATE: document.querySelector("#tmpl"),
  MESSAGE_LIST: document.querySelector(".dialog__message-list"),

  SETTINGS_OPEN: document.querySelector(".dialog__btn-settings"),
  SETTINGS: document.querySelector("#settings"),
  AUTHORIZATION: document.querySelector("#authorization"),
  AUTHORIZATION_MAIL_SUBMIT: document.querySelector("#authorization_mail"),
  AUTHORIZATION_MAIL_INPUT: document.querySelector("#authorization_mail_input"),
  AUTHORIZATION_CODE_SUBMIT: document.querySelector("#authorization_code"),
  AUTHORIZATION_CODE_INPUT: document.querySelector("#authorization_code_input"),

  POPUP_CLOSE: document.querySelectorAll(".popup__header-close"),
  POPUP_BODY: document.querySelectorAll(".popup"),
};

const URL = "https://mighty-cove-31255.herokuapp.com/api/user";

UI_ELEMENTS.DIALOG_SUBMIT.addEventListener("click", function () {
  const messageText = UI_ELEMENTS.DIALOG_INPUT.value;
  UI_ELEMENTS.DIALOG_INPUT.value = "";
  UI_ELEMENTS.DIALOG_INPUT.focus();
  if (messageText) {
    UI_ELEMENTS.MESSAGE_LIST.append(renderMessage(messageText));
  }
});

renderHistory();
getCode();
enterCode();

function getCode() {
  UI_ELEMENTS.AUTHORIZATION_MAIL_SUBMIT.addEventListener("click", function () {
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
  });
}

function enterCode() {
  UI_ELEMENTS.AUTHORIZATION_CODE_SUBMIT.addEventListener(
    "click",
    async function () {
      const userCode = UI_ELEMENTS.AUTHORIZATION_CODE_INPUT.value;
      if (userCode) {
        Cookies.set("token", userCode);
        const response = await fetch(URL, {
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
  );
}


async function renderHistory() {
  try {
    const URL = "https://mighty-cove-31255.herokuapp.com/api/messages";
    const response = await fetch(URL, {
      method: "GET",
    });
    const messages = await response.json();

    for (let i = 0; i < 5; i++) {
      const text = messages.messages[i].text;
      const name = messages.messages[i].user.name;
      const time = messages.messages[i].createdAt;
      UI_ELEMENTS.MESSAGE_LIST.append(renderMessage(text, name, time));
    }
  } catch (err) {
    console.log(err);
  }
}

socketConnect();
function socketConnect() {
  const url = `ws://mighty-cove-31255.herokuapp.com/websockets?${Cookies.get(
    "token"
  )}`;
  const socket = new WebSocket(url);

  socket.onopen = (event) => {
    console.log("[socket] соединение установлено");
    socket.send(
      JSON.stringify({
        text: "тестовый тест",
      })
    );
  };

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log(data);
  };
}

async function loadMail(email) {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8",
    },
    body: email,
  });
  return response;
}

function renderMessage(text, name = "userName", time = new Date()) {
  const message = UI_ELEMENTS.MESSAGE_TEMPLATE.content.cloneNode(true);
  const MESSAGE_UI_ELEMENTS = {
    PARENT: message.querySelector(".dialog__message"),
    TEXT: message.querySelector(".dialog__message-text"),
    TIME: message.querySelector(".dialog__message-time"),
    NAME: message.querySelector(".dialog__message-name"),
  };
  MESSAGE_UI_ELEMENTS.NAME.textContent = `${name}: `;
  MESSAGE_UI_ELEMENTS.TEXT.textContent += text;
  MESSAGE_UI_ELEMENTS.TIME.textContent = format(parseISO(time), "HH:mm");
  MESSAGE_UI_ELEMENTS.PARENT.classList.add("dialog__someone_message");
  return message;
}
