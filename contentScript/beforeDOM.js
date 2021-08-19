chrome.runtime.sendMessage({ type: "beforeDOM" }, (response) => {
  if (
    response.state &&
    response.state.setting &&
    response.state.listTodo.length
  ) {
    if (
      (response.state.setting.facebook ||
        response.state.setting.tiktok ||
        response.state.setting.youtube ||
        response.state.setting.instagram) &&
      response.state.listTodo.some((item) => item.checked == false)
    ) {
      document.documentElement.style.display = "none";
    }
  }
});
