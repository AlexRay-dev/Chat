import { sendMessageUI } from "./view.js";
import { renderHistory } from "./api.js";
import { popupsInit } from "./popups.js";
import { socketConnect } from "./socket.js";
import Cookies from "js-cookie";

export const URL = "mighty-cove-31255.herokuapp.com";
export const getToken = () => {
  return Cookies.get("token");
};
export const socket = new WebSocket(`ws://${URL}/websockets?${getToken()}`);

popupsInit();
chatInit();

async function chatInit() {
  await renderHistory();
  socketConnect();
  sendMessageUI();
}

