import { getCode, enterCode } from "./api.js";
import { sendMessage } from "./socket.js";
import { format } from "date-fns";
import { parseISO } from "date-fns/esm";
import { getValidJson } from "./utils.js";

export const UI_ELEMENTS = {
  DIALOG_INPUT: document.querySelector(".dialog__message-input"),
  DIALOG_SUBMIT: document.querySelector(".dialog__message-submit"),
  MESSAGE_TEMPLATE: document.querySelector("#tmpl"),
  MESSAGE_WRAPPER: document.querySelector(".dialog__message-box"),
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

UI_ELEMENTS.AUTHORIZATION_MAIL_SUBMIT.addEventListener("click", getCode);
UI_ELEMENTS.AUTHORIZATION_CODE_SUBMIT.addEventListener("click", enterCode);

UI_ELEMENTS.MESSAGE_WRAPPER.addEventListener("scroll", function () {
  if (this.scrollTop === 0) {
    console.log(true);
    renderHistory("withoutBottomScroll");
  }
});

function scrollToBottom() {
  const chatWrapper = UI_ELEMENTS.MESSAGE_WRAPPER;
  chatWrapper.scrollTop = chatWrapper.scrollHeight;
}

export function sendMessageUI() {
  UI_ELEMENTS.DIALOG_SUBMIT.addEventListener("click", function () {
    const messageText = UI_ELEMENTS.DIALOG_INPUT.value;
    UI_ELEMENTS.DIALOG_INPUT.value = "";
    UI_ELEMENTS.DIALOG_INPUT.focus();
    if (messageText) {
      sendMessage(messageText);
    }
  });
}

export function renderHistory(scroll) {
  const history = getValidJson("parse", localStorage.getItem("history"));
  const lastMessage = history.length;
  const count = 10;

  for (let i = count; i > 0; i--) {
    const text = history.at(-1).text;
    const name = history.at(-1).user.name;
    const time = history.at(-1).createdAt;
    renderMessage(text, name, time, scroll);
    history.pop();
  }
  localStorage.setItem("history", getValidJson("stringify", history));
  console.log("???????????????? ??????????????");
}

export function renderMessage(text, name = "userName", time, scroll) {
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
  UI_ELEMENTS.MESSAGE_LIST.prepend(message);
  console.log("??????????????????");
  if (!scroll) {
    scrollToBottom();
  }
}
