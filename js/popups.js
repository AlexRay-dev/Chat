import {UI_ELEMENTS} from './view.js'

export function popupsInit() {
  UI_ELEMENTS.SETTINGS_OPEN.addEventListener("click", function () {
    UI_ELEMENTS.SETTINGS.classList.add("popup--active");
  });
  UI_ELEMENTS.POPUP_CLOSE.forEach((closeBtn) => {
    closeBtn.addEventListener("click", function () {
      const parent = this.closest(".popup");
      parent.classList.remove("popup--active");
    });
  });
  UI_ELEMENTS.POPUP_BODY.forEach((body) => {
    body.addEventListener("click", function (event) {
      if (event.target === body) {
        body.classList.remove("popup--active");
      }
    });
  });
}
