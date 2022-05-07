import { sendMessageUI, renderHistory } from "./view.js";
import { getToken } from "./utils.js";
import { popupsInit } from "./popups.js";
import { socketConnect } from "./socket.js";

export const URL = "mighty-cove-31255.herokuapp.com";
export const socket = new WebSocket(`ws://${URL}/websockets?${getToken()}`);

popupsInit();
chatInit();

function chatInit() {
  renderHistory();
  socketConnect();
  sendMessageUI();
}

