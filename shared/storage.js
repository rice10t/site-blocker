export function getIsBlocking() {
  return browser.storage.local.get("isBlocking").then((maybeIsBlocking) => {
    console.log({
      maybeIsBlocking: maybeIsBlocking.isBlocking,
      validated: validateIsBlocking(maybeIsBlocking.isBlocking),
    });
    // 初期インストール時は `maybeIsBlocking` は空object
    return validateIsBlocking(maybeIsBlocking.isBlocking)
      ? maybeIsBlocking.isBlocking
      : false;
  });
}

export function getSiteList() {
  return browser.storage.sync.get("siteList").then((maybeSiteList) => {
    return validateSiteList(maybeSiteList.siteList)
      ? maybeSiteList.siteList
      : "";
  });
}

export function setIsBlocking(isBlocking) {
  if (!validateIsBlocking(isBlocking)) {
    throw Error("isBlocking must be boolean");
  }

  return browser.storage.local.set({
    isBlocking,
  });
}

export function setSiteList(siteList) {
  if (!validateSiteList(siteList)) {
    throw Error("siteList must be string");
  }

  return browser.storage.sync.set({
    siteList,
  });
}

export function validateIsBlocking(isBlocking) {
  return typeof isBlocking === "boolean";
}

export function validateSiteList(siteList) {
  return typeof siteList === "string";
}
