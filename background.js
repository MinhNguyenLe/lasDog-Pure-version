let state = {};
let isBlock = false;

// set communicate
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.type == "action") {
    state = msg.state;
    response({ state });
  }
  if (msg.type == "beforeDOM") {
    response({ state });
  }
  if (msg.type == "facebook") {
    response({ state });
  }
  if (msg.type == "youtube") {
    response({ state });
  }
  if (msg.type == "tiktok") {
    response({ state });
  }
  if (msg.type == "instagram") {
    response({ state });
  }
});
