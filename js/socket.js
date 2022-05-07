import { socket } from "./main.js";
import { getValidJson } from "./utils.js";
import { renderMessage } from "./view.js";

export function socketConnect() {
  console.log("[socket] первичное соединение установлено");
  try {
    // socket.onmessage = function (event) {
    //     console.log(event.data);
    //   const data = getValidJson("parse", event.data);
    //   renderMessage(data.text, data.user.name, data.createdAt);
    // };
  } catch (err) {
    alert(err);
  }
}

export function sendMessage(text) {
  console.log("[socket] отправка сообщения");
  if (text) {
    try {
      const messageText = {
        text: text,
      };
      socket.send(getValidJson("stringify", messageText));
    } catch (err) {
      alert(err);
    }
  } else {
    console.log("[socket] сообщение пустое");
  }
}
