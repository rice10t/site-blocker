import { getIsBlocking, getSiteList } from "./shared/storage.js";
import { checkMatch } from "./shared/checkMatch.js";

const css = `body > :not(#block-message) {
  display: none;
}

body {
  background-color: black;
}

#block-message {
  color: white;
  font-size: 30px;
  font-family: "sans-serif";
}
`;

browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "openTab") {
    return handleOpenTab(sender);
  } else if (message.type === "turnOn") {
    return handleTurnOn();
  } else if (message.type === "turnOff") {
    return handleTurnOff();
  } else if (message.type === "refresh") {
    return handleRefresh();
  }
});

function handleOpenTab(sender) {
  if (sender.tab.url === undefined) {
    return Promise.resolve();
  }

  return Promise.all([getIsBlocking(), getSiteList()]).then(
    ([isBlocking, siteList]) => {
      if (isBlocking && checkMatch(sender.tab.url, siteList)) {
        return showBlockMessage(sender.tab.id);
      }
    }
  );
}

function handleTurnOn() {
  return Promise.all([browser.tabs.query({}), getSiteList()]).then(
    ([tabs, siteList]) => {
      const promises = tabs
        .filter((tab) => {
          return tab.url !== undefined && checkMatch(tab.url, siteList);
        })
        .map((tab) => {
          return showBlockMessage(tab.id);
        });

      return Promise.all(promises);
    }
  );
}

function handleTurnOff() {
  return Promise.all([browser.tabs.query({}), getSiteList()]).then(
    ([tabs, siteList]) => {
      const promises = tabs
        .filter((tab) => {
          return tab.url !== undefined && checkMatch(tab.url, siteList);
        })
        .map((tab) => {
          return hideBlockMessage(tab.id);
        });

      return Promise.all(promises);
    }
  );
}

function handleRefresh() {
  getIsBlocking().then((isBlocking) => {
    // TODO
  });
}

function showBlockMessage(tabId) {
  return hideBlockMessage(tabId)
    .then(() => {
      return browser.tabs.insertCSS(tabId, {
        code: css,
      });
    })
    .then(() => {
      return browser.tabs.sendMessage(tabId, { type: "showMessage" });
    });
}

function hideBlockMessage(tabId) {
  return browser.tabs.removeCSS(tabId, { code: css }).then(() => {
    return browser.tabs.sendMessage(tabId, { type: "hideMessage" });
  });
}
