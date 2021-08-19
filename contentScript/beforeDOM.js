chrome.storage.local.get(["state"], function (result) {
  if (result.state && result.state.setting && result.state.listTodo.length) {
    if (
      (result.state.setting.facebook ||
        result.state.setting.tiktok ||
        result.state.setting.youtube ||
        result.state.setting.instagram) &&
      result.state.listTodo.some((item) => item.checked == false)
    ) {
      document.documentElement.style.display = "none";
    }
  }
});
