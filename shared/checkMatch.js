export function checkMatch(url, siteList) {
  const siteStringList = siteList.split("\n");

  return siteStringList.some((siteString) => {
    return url.search(siteString) !== -1;
  });
}
