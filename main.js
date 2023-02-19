browser.runtime.sendMessage({ type: "openTab" });

browser.runtime.onMessage.addListener((message) => {
  if (message.type === "showMessage") {
    const message = document.createElement("div");
    message.textContent = "Blocked";
    message.setAttribute("id", "block-message");
    document.body.appendChild(message);
  } else if (message.type === "hideMessage") {
    const oldMessage = document.getElementById("block-message");
    oldMessage?.remove();
  }
});
