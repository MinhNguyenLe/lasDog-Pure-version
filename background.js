let state = {};
let isBlock = false;

// set communicate
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.type == "action") {
    state = msg.state;
    response({ state });
  }
  if (msg.type == "matchParent") {
    response({ state });
  }
});
