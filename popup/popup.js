import {
  getIsBlocking,
  getSiteList,
  setIsBlocking,
  setSiteList,
} from "../shared/storage.js";

const blockingOnInput = document.getElementById("blocking-on");
const blockingOffInput = document.getElementById("blocking-off");
const siteListTextArea = document.getElementById("site-list");
const saveButton = document.getElementById("save-site-list");

getIsBlocking().then((isBlocking) => {
  if (isBlocking) {
    blockingOnInput.checked = true;
  } else {
    blockingOffInput.checked = true;
  }
});

getSiteList().then((siteList) => {
  siteListTextArea.textContent = siteList;
});

blockingOnInput.addEventListener("click", () => {
  setIsBlocking(true).then(() => {
    return browser.runtime.sendMessage({ type: "turnOn" });
  });
});

blockingOffInput.addEventListener("click", () => {
  setIsBlocking(false).then(() => {
    return browser.runtime.sendMessage({ type: "turnOff" });
  });
});

saveButton.addEventListener("click", () => {
  const siteList = siteListTextArea.value;

  setSiteList(siteList).then(() => {
    return browser.runtime.sendMessage({ type: "refresh" });
  });
});
