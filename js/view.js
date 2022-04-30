import { format } from "date-fns";
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
    } else {
      alert("введите корректную почту");
    }
  });
}
function enterCode() {
  UI_ELEMENTS.AUTHORIZATION_CODE_SUBMIT.addEventListener("click", function () {
    const userCode = UI_ELEMENTS.AUTHORIZATION_CODE_INPUT.value;
    if (userCode) {
      Cookies.set("token", userCode);
      const token = Cookies.get("token");
      fetch(URL, {
        method: "PATCH",
        headers: {
            Authorization: `bearer ${token}`,
        },
        body: { name: "Alex" },
      });
    }
  });
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

function renderMessage(text) {
  const message = UI_ELEMENTS.MESSAGE_TEMPLATE.content.cloneNode(true);
  const MESSAGE_UI_ELEMENTS = {
    TEXT: message.querySelector(".dialog__message-text"),
    TIME: message.querySelector(".dialog__message-time"),
  };
  MESSAGE_UI_ELEMENTS.TEXT.textContent += text;
  MESSAGE_UI_ELEMENTS.TIME.textContent = format(new Date(), "hh:mm");
  return message;
}
