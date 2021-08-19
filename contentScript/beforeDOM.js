chrome.runtime.sendMessage({ type: "beforeDOM" }, (response) => {
  if (response.state && response.state.listTodo.length) {
    if (response.state.listTodo.some((item) => item.checked == false)) {
      document.documentElement.style.display = "none";
    }
  }
});
